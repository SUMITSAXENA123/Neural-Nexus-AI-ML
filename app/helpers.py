import pandas as pd
import os

def load_data(filename):
    """Load data from CSV file"""
    try:
        data_path = os.path.join('data', filename)
        return pd.read_csv(data_path)
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

def process_data(df):
    """Process dataframe for analysis"""
    if df is None:
        return None
    
    # Add your data processing logic here
    return df 