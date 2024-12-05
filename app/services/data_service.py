import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime, timedelta
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataService:
    def __init__(self):
        self.data_path = Path(os.path.join(os.getcwd(), 'data', 'processed_data.csv'))
        self.data_cache = None
        self.cache_timestamp = None
        self.cache_duration = 300  # 5 minutes
        logger.info(f"Data path set to: {self.data_path}")
        
    def get_data(self, force_refresh=False):
        """Get processed data with caching"""
        current_time = datetime.now()
        
        if not force_refresh and self.data_cache is not None:
            if (current_time - self.cache_timestamp).seconds < self.cache_duration:
                return self.data_cache
                
        try:
            if not self.data_path.exists():
                logger.error(f"Data file not found at {self.data_path}")
                return pd.DataFrame()
                
            logger.info(f"Loading data from {self.data_path}")
            df = pd.read_csv(self.data_path)
            df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
            df['total_amount'] = df['Quantity'] * df['Price']
            
            # Calculate time-based features
            df['hour'] = df['InvoiceDate'].dt.hour
            df['day_of_week'] = df['InvoiceDate'].dt.dayofweek
            
            # Calculate customer-level metrics
            customer_stats = df.groupby('Customer ID').agg({
                'Invoice': 'count',
                'total_amount': ['sum', 'mean', 'std'],
                'Quantity': ['sum', 'mean']
            }).reset_index()
            
            # Flatten column names
            customer_stats.columns = ['Customer ID', 'transaction_count', 'total_amount', 
                                    'avg_amount', 'std_amount', 'total_quantity', 'avg_quantity']
            
            # Calculate risk score (0-100)
            amount_percentile = customer_stats['total_amount'].rank(pct=True)
            transaction_percentile = customer_stats['transaction_count'].rank(pct=True)
            volatility = (customer_stats['std_amount'] / customer_stats['avg_amount']).fillna(0)
            volatility_percentile = volatility.rank(pct=True)
            
            customer_stats['risk_score'] = (
                (amount_percentile * 0.4 + 
                 transaction_percentile * 0.3 + 
                 volatility_percentile * 0.3) * 100
            ).round(2)
            
            # Mark anomalies (risk score > 80 or extreme values)
            customer_stats['is_anomaly'] = (
                (customer_stats['risk_score'] > 80) |
                (customer_stats['total_amount'] > customer_stats['total_amount'].quantile(0.95)) |
                (customer_stats['transaction_count'] > customer_stats['transaction_count'].quantile(0.95))
            )
            
            # Merge back to main dataframe
            df = df.merge(
                customer_stats[['Customer ID', 'is_anomaly', 'risk_score']], 
                on='Customer ID', 
                how='left'
            )
            
            self.data_cache = df
            self.cache_timestamp = current_time
            logger.info("Data loaded and processed successfully")
            
            return df
            
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            return pd.DataFrame()
            
    def get_anomaly_insights(self):
        """Get insights about anomalies"""
        try:
            df = self.get_data()
            if df.empty:
                logger.error("No data available for anomaly insights")
                return None
                
            # Get high-risk customers
            high_risk_customers = df[df['is_anomaly']].groupby('Customer ID').agg({
                'total_amount': 'sum',
                'Invoice': 'count',
                'Country': 'first',
                'is_anomaly': 'first',
                'risk_score': 'first'
            }).reset_index()
            
            # Sort by risk score to get highest risk
            high_risk_customers = high_risk_customers.sort_values(
                'risk_score', 
                ascending=False
            )
            
            # Get recent anomalous transactions
            recent_anomalies = df[df['is_anomaly']].sort_values(
                'InvoiceDate', 
                ascending=False
            ).head(5)
            
            # Calculate time-based metrics
            current_time = datetime.now()
            last_24h = current_time - timedelta(days=1)
            last_24h_data = df[df['InvoiceDate'] > last_24h]
            
            insights = {
                'high_risk_customers': high_risk_customers.to_dict('records'),
                'recent_anomalies': recent_anomalies.to_dict('records'),
                'total_anomalies': int(df['is_anomaly'].sum()),
                'anomaly_rate': float(df['is_anomaly'].mean() * 100),
                'total_amount_at_risk': float(df[df['is_anomaly']]['total_amount'].sum()),
                'countries_affected': df[df['is_anomaly']]['Country'].nunique(),
                'last_24h_stats': {
                    'total_transactions': len(last_24h_data),
                    'anomalies_24h': int(last_24h_data['is_anomaly'].sum()),
                    'amount_24h': float(last_24h_data['total_amount'].sum())
                }
            }
            
            logger.info("Anomaly insights generated successfully")
            return insights
            
        except Exception as e:
            logger.error(f"Error getting anomaly insights: {str(e)}")
            return None 