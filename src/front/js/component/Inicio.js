import React from "react";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { auth, provider } from "./firebase"; // Asegúrate de que la ruta sea correcta
import { signInWithPopup } from "firebase/auth";
import "../../styles/inicio.css";

const Inicio = () => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuario autenticado:", user);
      // Aquí puedes manejar el usuario autenticado, como guardar el token en el localStorage
      localStorage.setItem("jwt-token", user.accessToken);
      // Redirigir o actualizar el estado de la aplicación según sea necesario
      window.location.href = `/private/${user.uid}`; // Redirige al perfil del usuario
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };
  
  return (
    <div className="fondo-inicio">
      <Container className="contenedor-inicio">
        <h1 className="titulo-inicio">ULTIMO PROYECTO</h1>
        <h5 className="texto-destacado">Sistema de Autenticación con Python, Flask y React.js</h5>
        <p className="texto-destacado">
          Registro, Login y Backend
        </p>
        <hr className="linea-divisoria" />
        <p>
          ¡Regístrate ahora!!
        </p>
        <p className="botones-inicio">
          <Link className="boton-inicio boton-registro" to="/signup" role="button">
            REGÍSTRATE
          </Link>
          <Link className="boton-inicio boton-sesion" to="/login" role="button">
            INICIAR SESIÓN
          </Link>
          
          <button className="boton-inicio" onClick={() => window.location.href = "/google_login"}>
           Iniciar sesión con Google
         </button>
        </p>
      </Container>
    </div>
  );
};
console.log("Inicio componente Inicio");
export default Inicio;
