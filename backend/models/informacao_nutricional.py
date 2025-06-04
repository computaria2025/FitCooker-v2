from db import db

class InformacaoNutricional(db.Model):
    __tablename__ = 'informacao_nutricional'

    id_info = db.Column(db.Integer, primary_key=True)
    carboidratos = db.Column(db.Numeric(8,2), nullable=False)
    proteinas = db.Column(db.Numeric(8,2), nullable=False)
    sodio = db.Column(db.Numeric(8,2), nullable=False)
    gorduras_trans = db.Column(db.Numeric(8,2), nullable=False)
    gordura_saturada = db.Column(db.Numeric(8,2), nullable=False)
    fibra_alimentar = db.Column(db.Numeric(8,2), nullable=False)
    fk_Receitas_id_receita = db.Column(db.Integer, db.ForeignKey('receitas.id_receita'), nullable=False)
