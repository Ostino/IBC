import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, getAllUsers, promoteToAdmin } from "../services/usuarioService";

const AdmUsuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    getProfile(token)
      .then((user) => {
        console.log(user)
        if (user.rol !== 1) throw new Error("No autorizado");
        return getAllUsers(token);
      })
      .then((data) => {
        setUsuarios(data);
      })
      .catch((err) => {
        console.log(user)
        console.error(err);
        alert("Acceso denegado o token inválido");
        navigate("/login");
      });
  }, [navigate]);

const handlePromote = async (id) => {
  try {
    const token = sessionStorage.getItem("token");
    
    await promoteToAdmin(id, token);
    alert("Usuario promovido a admin.");
  } catch (error) {
    alert("Error al promover usuario");
    console.error(error);
  }
};

const handleLogoutAll = async () => {
    try {
      await logoutAll(token);
    } catch (err) {
      console.error("Error al cerrar todas las sesiones:", err);
    } finally {
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  };
  return (
    <div>
      <h1>Administrar Usuarios</h1>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.username} - {usuario.email} - Rol: {usuario.rol}
            {" "}
            <button onClick={() => handlePromote(usuario.id)}>Promover</button>
          </li>
        ))}
      </ul>
        <button onClick={() => handleLogoutAll()}>Cerrar todas las sesiones</button>
        <button onClick={() => navigate("/admMonedas")}>Crud Monedas</button>                      
    </div>
  );
};

export default AdmUsuarios;
