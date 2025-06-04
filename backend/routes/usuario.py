from flask import Blueprint, request, jsonify
from models.usuario import Usuario
from db import db

bp = Blueprint('usuario', __name__, url_prefix='/usuario')

@bp.route('/', methods=['POST'])
def create_usuario():
    data = request.json
    usuario = Usuario(**data)
    db.session.add(usuario)
    db.session.commit()
    return jsonify({'message': 'Usuário criado com sucesso'})

@bp.route('/<id_usuario>', methods=['GET'])
def get_usuario(id_usuario):
    usuario = Usuario.query.get_or_404(id_usuario)
    return jsonify({
        'id_usuario': usuario.id_usuario,
        'email_usuario': usuario.email_usuario,
        'nome_usuario': usuario.nome_usuario
    })

@bp.route('/<id_usuario>', methods=['PUT'])
def update_usuario(id_usuario):
    usuario = Usuario.query.get_or_404(id_usuario)
    data = request.json
    for key, value in data.items():
        setattr(usuario, key, value)
    db.session.commit()
    return jsonify({'message': 'Usuário atualizado'})

@bp.route('/<id_usuario>', methods=['DELETE'])
def delete_usuario(id_usuario):
    usuario = Usuario.query.get_or_404(id_usuario)
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({'message': 'Usuário deletado'})
