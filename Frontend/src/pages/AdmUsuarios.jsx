import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, getAllUsers, promoteToAdmin  } from "../services/usuarioService";
import { logoutAll } from "../services/authService";
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
        if (user.rol !== 1) throw new Error("No autorizado");
        return getAllUsers(token);
      })
      .then((data) => {
        setUsuarios(data);
      })
      .catch((err) => {
        console.error(err);
        alert("Acceso denegado o token inválido");
        navigate("/login");
      });
  }, [navigate]);

  const handlePromote = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No autorizado");

      await promoteToAdmin(id, token);
      alert("Usuario promovido a admin.");

      const data = await getAllUsers(token);
      setUsuarios(data);
    } catch (error) {
      alert("Error al promover usuario");
      console.error(error);
    }
  };

  const handleLogoutAll = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No autorizado");

      await logoutAll(token);
    } catch (err) {
      console.error("Error al cerrar todas las sesiones:", err);
    } finally {
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "3rem auto",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#f9f9f9",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        Administrar Usuarios
      </h1>

      <ul style={{ listStyle: "none", padding: 0, marginBottom: "2rem" }}>
        {usuarios.map((usuario) => (
          <li
            key={usuario.id}
            style={{
              backgroundColor: "#fff",
              padding: "1rem 1.5rem",
              marginBottom: "0.75rem",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong style={{ color: "#222" }}>{usuario.username}</strong>{" "}
              <span style={{ color: "#666" }}> - {usuario.email}</span>{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: usuario.rol === 1 ? "#2c7a7b" : "#718096",
                  marginLeft: "0.5rem",
                }}
              >
                {usuario.rol === 1 ? "Admin" : "Usuario"}
              </span>
            </div>
            {usuario.rol !== 1 && (
              <button
                onClick={() => handlePromote(usuario.id)}
                style={{
                  backgroundColor: "#3182ce",
                  border: "none",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2c5282")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3182ce")}
              >
                Promover a admin
              </button>
            )}
          </li>
        ))}
      </ul>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleLogoutAll}
          style={{
            backgroundColor: "#e53e3e",
            border: "none",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            cursor: "pointer",
            marginRight: "1rem",
            fontWeight: "600",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#9b2c2c")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e53e3e")}
        >
          Cerrar todas las sesiones
        </button>

        <button
          onClick={() => navigate("/admMonedas")}
          style={{
            backgroundColor: "#38a169",
            border: "none",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#276749")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#38a169")}
        >
          CRUD Monedas
        </button>
      </div>
    </div>
  );
};

export default AdmUsuarios;
