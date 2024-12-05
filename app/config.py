import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///fraudlens.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Cache settings
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 300
    
    # API settings
    API_TITLE = 'FraudLens API'
    API_VERSION = 'v1'
    
    # Session settings
    PERMANENT_SESSION_LIFETIME = timedelta(days=1)
