from db import db

class Receitas(db.Model):
    __tablename__ = 'receitas'

    id_receita = db.Column(db.Integer, primary_key=True)
    categoria = db.Column(db.String(100), nullable=False)
    ingredientes = db.Column(db.Text, nullable=False)
    nome_receita = db.Column(db.String(30), nullable=False)
    descricao_receita = db.Column(db.Text, nullable=False)
    armazenamento_ftvd = db.Column(db.String(150), nullable=False)
    data_receita = db.Column(db.Date, nullable=False)
    fk_Site_id_site = db.Column(db.Integer, db.ForeignKey('site.id_site'), nullable=False)
    fk_Usuario_id_usuario = db.Column(db.String(30), db.ForeignKey('usuario.id_usuario'), nullable=False)

    feedbacks = db.relationship('Feedback', backref='receita', lazy=True)
    info_nutricional = db.relationship('InformacaoNutricional', backref='receita', lazy=True)
    salvas = db.relationship('ReceitasSalvas', backref='receita', lazy=True)
