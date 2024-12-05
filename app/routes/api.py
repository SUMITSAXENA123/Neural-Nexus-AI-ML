from flask import Blueprint, jsonify

api = Blueprint('api', __name__)

@api.route('/metrics')
def get_metrics():
    return jsonify({
        "total_transactions": 525461,
        "total_fraud": 26228,
        "fraud_rate": 4.99,
        "total_amount": "2009 - 2010"
    }) 