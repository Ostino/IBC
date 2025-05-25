import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getProfile } from "../services/usuarioService";
import { logout, logoutAll } from "../services/authService";
import { getAllMonedas } from "../services/monedaService";
import { getBilletera } from "../services/billeteraService";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [monedas, setMonedas] = useState([]);
  const [billeteras, setBilleteras] = useState([]);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userData = await getProfile(token);
        setUser(userData);

        const [todasMonedas, billeterasUsuario] = await Promise.all([
          getAllMonedas(token),
          getBilletera(token),
        ]);

        const billeterasConMoneda = billeterasUsuario.map((billetera) => {
          const moneda = todasMonedas.find((m) => m.id === billetera.monedaId);
          return {
            ...billetera,
            moneda,
          };
        });

        setMonedas(todasMonedas);
        setBilleteras(billeterasConMoneda);
      } catch (err) {
        if (err.response?.status === 401) {
          sessionStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Error al cargar datos del perfil:", err);
        }
      }
    };

    fetchData();
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
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Perfil</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Usuario:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleLogout} style={{ marginRight: "1rem" }}>
          Cerrar sesión
        </button>
        <button onClick={handleLogoutAll}>Cerrar todas las sesiones</button>
        <button onClick={() => navigate("/registrar-anuncio")}>
        Registrar anuncio
        </button>
      </div>
          
      <div style={{ marginTop: "2rem" }}>
        <h3>Mis Billeteras</h3>
        {billeteras.length === 0 ? (
          <p>No tienes billeteras.</p>
        ) : (
          <ul>
            {billeteras.map((b) => (
              <li key={b.id}>
                <strong>{b.moneda.nombre}</strong> - Saldo: {b.saldo}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3>Monedas disponibles</h3>
        <ul>
          {monedas.map((moneda) => (
            <li key={moneda.id}>
              <Link to={`/compraventa/${moneda.id}`} style={{ textDecoration: "none", color: "#0077cc" }}>
                {billeteras.some((b) => b.moneda.id === moneda.id) ? "✔ " : ""}
                {moneda.codigo} - {moneda.nombre} (Valor: {moneda.valueInSus} SUS)
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
