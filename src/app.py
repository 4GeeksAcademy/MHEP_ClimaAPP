import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt

# Configuración del entorno y parámetros
ENV = os.getenv("FLASK_ENV", "development")
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Configuración del JWT
app.config["JWT_SECRET_KEY"] = "super-secret"
jwt = JWTManager(app)

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL", "sqlite:////tmp/test.db")
app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://") if db_url else db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar dependencias
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)
bcrypt = Bcrypt(app)

# Habilitar CORS globalmente
CORS(app)

# Configurar Admin y Comandos
setup_admin(app)
setup_commands(app)

# Registrar rutas con prefijo 'api'
app.register_blueprint(api, url_prefix='/api')

# Manejar errores
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Generar mapa de rutas
@app.route('/')
def sitemap():
    return generate_sitemap(app) if ENV == "development" else send_from_directory(static_file_dir, 'index.html')

# Servir archivos estáticos
@app.route('/<path:path>', methods=['GET'])
def serve_static_files(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # Desactivar cache
    return response

# Registro de usuario
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    app.logger.info("Registro recibido: %s", data)
    
    # Verificación de existencia de usuario
    user = User.query.filter_by(email=data.get("email")).first()
    if user:
        return jsonify({"msg": "Email ya existe"}), 400
    
    # Crear nuevo usuario
    nuevo_usuario = User(
        email=data.get("email"),
        nombre=data.get("nombre"),
        apellido=data.get("apellido"),
        ciudad=data.get("ciudad"),
        is_active=True,
        password=bcrypt.generate_password_hash(data.get("password")).decode('utf-8'),
    )
    db.session.add(nuevo_usuario)
    db.session.commit()
    
    # Crear token de acceso
    access_token = create_access_token(identity=nuevo_usuario.id)
    return jsonify({"token": access_token, "user_id": nuevo_usuario.id}), 201

# Login de usuario
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()

    # Verificación de credenciales
    if user and bcrypt.check_password_hash(user.password, data.get("password")):
        access_token = create_access_token(identity=user.id)
        return jsonify({"token": access_token, "user_id": user.id}), 200
    return jsonify({"msg": "Usuario o contraseña incorrectos."}), 401

# Cerrar sesión
@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"msg": "Sesión cerrada exitosamente"}), 200

# Endpoint privado
@app.route("/private/<int:user_id>", methods=["GET"])
@jwt_required()
def private(user_id):
    current_user_id = get_jwt_identity()
    
    if current_user_id != user_id:
        return jsonify({"message": "Acceso no autorizado"}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404
    
    response_data = {key: getattr(user, key) for key in ['id', 'email', 'nombre', 'apellido', 'ciudad', 'is_active']}
    return jsonify(response_data), 200

# Endpoint protegido
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    return jsonify(logged_in_as=get_jwt_identity()), 200

# Iniciar la aplicación
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
