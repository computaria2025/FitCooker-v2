from db import db

class ReceitasSalvas(db.Model):
    __tablename__ = 'receitas_salvas_salvam'

    fk_Receitas_id_receita = db.Column(db.Integer, db.ForeignKey('receitas.id_receita'), primary_key=True)
    fk_Usuario_id_usuario = db.Column(db.String(30), db.ForeignKey('usuario.id_usuario'), primary_key=True)
