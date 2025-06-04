from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from routes import usuario, site, receitas, feedback, informacao_nutricional, receitas_salvas, auth
    app.register_blueprint(usuario.bp)
    app.register_blueprint(site.bp)
    app.register_blueprint(receitas.bp)
    app.register_blueprint(feedback.bp)
    app.register_blueprint(informacao_nutricional.bp)
    app.register_blueprint(receitas_salvas.bp)
    app.register_blueprint(auth.bp)

    return app
