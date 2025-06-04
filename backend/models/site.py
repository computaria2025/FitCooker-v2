from db import db

class Site(db.Model):
    __tablename__ = 'site'

    id_site = db.Column(db.Integer, primary_key=True)
    nome_site = db.Column(db.String(150), nullable=False)
    url = db.Column(db.String(225), unique=True, nullable=False)
    descricao_site = db.Column(db.Text, nullable=False)
    data_site = db.Column(db.Date, nullable=False)
    fk_Usuario_id_usuario = db.Column(db.String(30), db.ForeignKey('usuario.id_usuario'), nullable=False)

    receitas = db.relationship('Receitas', backref='site', lazy=True)
