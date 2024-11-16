import React, { useState } from "react";
import { useActions } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "../../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const actions = useActions();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await actions.login(email, password);
      const { user_id } = data;
      navigate(`/private/${user_id}`);
    } catch (error) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <input
          className="login-input"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>

      {/* MODAL ERROR */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error de inicio de sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Su usuario o contraseña es incorrecto. Por favor, inténtelo
          nuevamente.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
