from datetime import datetime

def apply_filters(df, filters):
    try:
        if filters.get('country'):
            df = df[df['Country'] == filters['country']]
            
        if filters.get('date_from'):
            df = df[df['InvoiceDate'] >= datetime.strptime(filters['date_from'], '%Y-%m-%d')]
            
        if filters.get('date_to'):
            df = df[df['InvoiceDate'] <= datetime.strptime(filters['date_to'], '%Y-%m-%d')]
            
        if filters.get('min_amount'):
            df = df[df['total_amount'] >= float(filters['min_amount'])]
            
        return df
    except Exception as e:
        print(f"Error applying filters: {e}")
        return df
