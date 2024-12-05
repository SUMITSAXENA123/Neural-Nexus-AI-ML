import pandas as pd
from pathlib import Path

class DataLoader:
    def __init__(self):
        self.data_path = Path('data/processed_data.csv')
        self.data_cache = None
        
    def load_data(self):
        try:
            if self.data_cache is None:
                df = pd.read_csv(self.data_path)
                df['total_amount'] = df['Quantity'] * df['Price']
                df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
                self.data_cache = df
            return self.data_cache
        except Exception as e:
            print(f"Error loading data: {e}")
            return pd.DataFrame()
