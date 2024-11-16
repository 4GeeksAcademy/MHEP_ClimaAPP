import React, { useState } from "react";
import { useActions } from "../store/appContext.js";
import { Modal, Button, Card, Form } from "react-bootstrap";


const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    ciudad: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const actions = useActions();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    try {
      await actions.signup(
        formData.email,
        formData.password,
        formData.nombre,
        formData.apellido,
        formData.ciudad
      );
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error Durante el Registro:", error.message);
      setShowErrorModal(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setFormData({
      email: "",
      password: "",
      nombre: "",
      apellido: "",
      ciudad: "",
    });
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setFormData({
      email: "",
      password: "",
      nombre: "",
      apellido: "",
      ciudad: "",
    });
  };

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          <h2 className="mb-4">Registro</h2>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicFirstName">
              <Form.Label>Nombree</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicLastName">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inngresa tu Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicHometown">
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                type="text"
                placeholder="ingresa tu ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" type="button" onClick={handleSignup}>
              Registrar
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Modal de éxito */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Éxito</Modal.Title>
        </Modal.Header>
        <Modal.Body>El usuario ha sido creado con éxito.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de error */}
      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Usuario o contraseña no válidos. Por favor, inténtelo nuevamente.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseErrorModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Signup;