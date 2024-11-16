"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_cors import CORS

from flask_jwt_extended import jwt_required
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import JWTManager



# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False


# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"
jwt = JWTManager(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)
bcrypt = Bcrypt(app)


# Allow CORS requests to this API
CORS(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

#Registro de Usuario
@app.route("/signup", methods=["POST"])
@cross_origin()
def signup():
    data = request.get_json()
    app.logger.info("Dato Recibido del registro: %s", data) 
    email = data.get("email")
    password = data.get("password")
    nombre = data.get("nombre")
    apellido = data.get("apellido")
    ciudad = data.get("ciudad")

    usuario_existe = User.query.filter_by(email=email).first()
    if usuario_existe:
        return jsonify({"msg": "Email ya existe"}), 400
    
    nuevo_usuario = User(
        email=email,
        nombre=nombre,
        apellido=apellido,
        ciudad=ciudad,
        is_active=True,
        password=bcrypt.generate_password_hash(password).decode('utf-8'),
    )
    db.session.add(nuevo_usuario)
    db.session.commit()
    access_token = create_access_token(identity=nuevo_usuario.id)
    return jsonify({"token": access_token, "user_id": nuevo_usuario.id}), 201


#Login de Usuario
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        # Si el password es Correcto=> Genera el token

        access_token = create_access_token(identity=user.id)
        return jsonify({"token": access_token, "user_id": user.id}), 200
    else:
        # Pasword no se encuentra o es incorrecto
        return jsonify({"msg": "Usuario erroneo o mal Password."}), 401

# Cerrar Sesion
@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"msg": "Sesion Cerrada Exitosamente"}), 200


#Usuario Privado
@app.route("/private/<int:user_id>", methods=["GET"])
@jwt_required()
def private(user_id):
    current_user_id = get_jwt_identity()

    if current_user_id == user_id:
        user = User.query.get(user_id)

        if user:
            response_data = {
                "id": user.id,
                "email": user.email,
                "nombre": user.nombre,
                "apellido": user.apellido,
                "ciudad": user.ciudad,
                "is_active": user.is_active,
            }
            return jsonify(response_data), 200
        else:
            return jsonify({"message": "Usuario no encontrado"}), 404
    else:
        return jsonify({"message": "Acceso no autorizado"}), 403



@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
  
    usuario_actual = get_jwt_identity()
    return jsonify(logged_in_as=usuario_actual), 200

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
