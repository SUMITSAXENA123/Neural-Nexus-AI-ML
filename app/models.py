from app.extensions import db
from datetime import datetime

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    invoice = db.Column(db.String(50), unique=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))
    amount = db.Column(db.Float)
    quantity = db.Column(db.Integer)
    price = db.Column(db.Float)
    transaction_date = db.Column(db.DateTime, default=datetime.utcnow)
    country = db.Column(db.String(100))
    is_fraud = db.Column(db.Boolean, default=False)
    anomaly_score = db.Column(db.Float)
    
    def to_dict(self):
        return {
            'id': self.id,
            'invoice': self.invoice,
            'customer_id': self.customer_id,
            'amount': self.amount,
            'quantity': self.quantity,
            'price': self.price,
            'transaction_date': self.transaction_date.isoformat(),
            'country': self.country,
            'is_fraud': self.is_fraud,
            'anomaly_score': self.anomaly_score
        }

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.String(50), unique=True)
    country = db.Column(db.String(100))
    transactions = db.relationship('Transaction', backref='customer', lazy=True)
    risk_score = db.Column(db.Float)
    
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'country': self.country,
            'risk_score': self.risk_score,
            'total_transactions': len(self.transactions)
        }
