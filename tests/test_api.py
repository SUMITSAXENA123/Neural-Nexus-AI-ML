import unittest
from app import create_app, db
from app.models import Transaction, Customer

class TestAPI(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()
        
    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()
        
    def test_metrics_endpoint(self):
        response = self.client.get('/api/metrics')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('total_transactions', data)
        self.assertIn('total_amount', data)
        
    def test_transaction_search(self):
        # Create test data
        customer = Customer(customer_id='TEST001', country='US')
        db.session.add(customer)
        db.session.commit()
        
        transaction = Transaction(
            invoice='INV001',
            customer_id=customer.id,
            amount=100.0,
            quantity=1,
            price=100.0,
            country='US'
        )
        db.session.add(transaction)
        db.session.commit()
        
        # Test search
        response = self.client.get('/api/transactions?customer_id=TEST001')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['invoice'], 'INV001') 