from flask import Flask
from app.config import Config
from app.extensions import db, cache  # Ensure this file exists and is correct

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    cache.init_app(app)

    # Register blueprints
    from app.routes.api import api
    from app.routes.main import main

    app.register_blueprint(main)
    app.register_blueprint(api, url_prefix='/api')

    return app
