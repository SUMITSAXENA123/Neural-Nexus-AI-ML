import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from app.extensions import db, cache

class AnomalyService:
    def __init__(self):
        self.model = None
        self.iso_forest = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_jobs=-1
        )
    
    def detect_anomalies(self, df):
        try:
            if df.empty:
                return df
                
            features = self._prepare_features(df)
            
            # Fit and predict
            self.iso_forest.fit(features)
            anomaly_scores = self.iso_forest.score_samples(features)
            predictions = self.iso_forest.predict(features)
            
            # Add results to dataframe
            df['anomaly_score'] = anomaly_scores
            df['is_anomaly'] = predictions == -1
            
            return df
        except Exception as e:
            print(f"Error in anomaly detection: {e}")
            # Add default columns if error occurs
            df['anomaly_score'] = 0
            df['is_anomaly'] = False
            return df
            
    def _prepare_features(self, df):
        try:
            return pd.DataFrame({
                'amount': df['total_amount'].fillna(0),
                'quantity': df['Quantity'].fillna(0),
                'price': df['Price'].fillna(0),
                'hour': pd.to_datetime(df['InvoiceDate']).dt.hour,
                'day_of_week': pd.to_datetime(df['InvoiceDate']).dt.dayofweek
            })
        except Exception as e:
            print(f"Error preparing features: {e}")
            return pd.DataFrame() 