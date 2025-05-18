import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/usuarioService";
import { logout, logoutAll } from "../services/authService";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const data = await getProfile(token);
        setUser(data);
      } catch (err) {
        if (err.response?.status === 401) {
          sessionStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Error al obtener el perfil:", err);
        }
      }
    };

    fetchProfile();
  }, [navigate, token]);

  const handleLogout = async () => {
    try {
      await logout(token);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      sessionStorage.removeItem("token");
      navigate("/login");
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

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Perfil</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Usuario:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleLogout} style={{ marginRight: "1rem" }}>
          Cerrar sesión
        </button>
        <button onClick={handleLogoutAll}>Cerrar todas las sesiones</button>
      </div>
    </div>
  );
}
