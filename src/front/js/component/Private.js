import React, { useState, useEffect } from "react";
import { useActions } from "../store/appContext.js";
import { useParams } from "react-router-dom";

const Private = () => {
  const { user_id } = useParams();
  const actions = useActions();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await actions.getUserData(user_id);
        console.log("Datos de usuario desde API:", data);
        setUserData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching Datos usuario:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [actions, user_id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!userData) {
    return <div>Error al cargar datos del usuario.</div>;
  }

  return (
    <div>
      <h2>Perfil del Usuario</h2>
      <p>ID: {userData.id}</p>
      <p>Email: {userData.email}</p>
      <p>Nombre: {userData.nombre}</p>
      <p>Apellido: {userData.apellido}</p>
      <p>Ciudad: {userData.ciudad}</p>
      <p>Estado: {userData.is_active ? "Activo" : "Inactivo"}</p>
    </div>
  );
};

export default Private;