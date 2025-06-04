from db import db

class Feedback(db.Model):
    __tablename__ = 'feedback'

    id_feedback = db.Column(db.Integer, primary_key=True)
    comentario = db.Column(db.Text, nullable=False)
    avaliacao = db.Column(db.Integer, nullable=False)
    data_feedback = db.Column(db.Date, nullable=False)
    qtd_curtidas = db.Column(db.Integer, default=0, nullable=False)
    fk_Receitas_id_receita = db.Column(db.Integer, db.ForeignKey('receitas.id_receita'), nullable=False)
    fk_Usuario_id_usuario = db.Column(db.String(30), db.ForeignKey('usuario.id_usuario'), nullable=False)
