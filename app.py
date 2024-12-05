from flask import Flask
from app.config import Config
from app.extensions import db, cache

# Create and configure the app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
cache.init_app(app)

# Register blueprints
from app.routes.api import api
from app.routes.main import main

app.register_blueprint(main)
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
