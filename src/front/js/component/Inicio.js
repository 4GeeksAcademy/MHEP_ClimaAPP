import React from "react";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import "../../styles/inicio.css";

const Inicio = () => {
  return (
    <div className="fondo-inicio">
      <Container className="contenedor-inicio">
        <h1 className="titulo-inicio">¡BIENVENIDO A NUESTRA COMUNIDAD!</h1>
        <h5 className="texto-destacado">Sistema de Autenticación con Python, Flask y React.js</h5>
        <p className="texto-destacado">
          Conecta con amigos, comparte tus momentos y descubre nuevas experiencias.
        </p>
        <hr className="linea-divisoria" />
        <p>
          ¡Regístrate ahora y comienza a compartir tus momentos o inicia sesión si ya tienes una cuenta!
        </p>
        <p className="botones-inicio">
          <Link className="boton-inicio boton-registro" to="/signup" role="button">
            REGÍSTRATE
          </Link>
          <Link className="boton-inicio boton-sesion" to="/login" role="button">
            INICIAR SESIÓN
          </Link>
        </p>
      </Container>
    </div>
  );
};

export default Inicio;
