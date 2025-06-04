from db import db

class Usuario(db.Model):
    __tablename__ = 'usuario'

    id_usuario = db.Column(db.String(30), primary_key=True)
    email_usuario = db.Column(db.String(255), unique=True, nullable=False)
    senha = db.Column(db.String(60), nullable=False)
    nome_usuario = db.Column(db.String(60), nullable=False)

    sites = db.relationship('Site', backref='usuario', lazy=True)
    receitas = db.relationship('Receitas', backref='usuario', lazy=True)
    feedbacks = db.relationship('Feedback', backref='usuario', lazy=True)
    receitas_salvas = db.relationship('ReceitasSalvas', backref='usuario', lazy=True)
