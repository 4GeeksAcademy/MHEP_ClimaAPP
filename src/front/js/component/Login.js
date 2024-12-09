import React, { useState } from "react";
import { useActions } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "../../styles/login.css";


// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyApjxCBvwLVsW8B6WFLsgJ3AxCoMEM8--I",
  authDomain: "app-de-clima-cd5ef.firebaseapp.com",
  projectId: "app-de-clima-cd5ef",
  storageBucket: "app-de-clima-cd5ef.appspot.com",
  messagingSenderId: "157882657628",
  appId: "1:157882657628:web:3a8df06718e466630eef99",
  measurementId: "G-TRHDBC0V03",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const actions = useActions();
  const navigate = useNavigate();

  // Manejo del inicio de sesión con Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Aquí puedes guardar la información del usuario en tu base de datos
      const userData = {
        email: user.email,
        name: user.displayName,
        uid: user.uid,
      };

      // Guardar en localStorage o en tu base de datos
      localStorage.setItem('userCredentials', JSON.stringify(userData));

      // Navegar a la página privada
      navigate(`/private/${user.uid}`);
    } catch (error) {
      console.error("Error en el inicio de sesión con Google:", error);
      setShowModal(true);
    }
  };

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
        <button className="login-button" onClick={handleGoogleLogin}>
          Login with Google
        </button>
      </div>

      {/* MODAL ERROR */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error de inicio de sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Su usuario o contraseña es incorrecto. Por favor, inténtelo nuevamente.
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