from flask import Blueprint, render_template, jsonify, request
from app import db
from app.data_loader import DataLoader
from app.services.anomaly_service import AnomalyService
import pandas as pd
import plotly.express as px

main = Blueprint('main', __name__)
data_loader = DataLoader()
anomaly_service = AnomalyService()

@main.route('/')
def index():
    try:
        df = data_loader.load_data()
        if df.empty:
            return jsonify({"error": "No data available"}), 500

        total_transactions = len(df)
        df['is_fraud'] = (df['total_amount'] > df['total_amount'].quantile(0.95)).astype(int)
        total_fraud = len(df[df['is_fraud'] == 1])
        fraud_rate = (total_fraud / total_transactions) * 100 if total_transactions > 0 else 0
        
        return render_template('index.html',
                             total_transactions=total_transactions,
                             total_fraud=total_fraud,
                             fraud_rate=round(fraud_rate, 2))
    except Exception as e:
        print(f"Dashboard error: {str(e)}")
        return jsonify({"error": str(e)}), 500
