import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMonedas } from "../services/monedaService";
import { crearBilletera } from "../services/billeteraService";

export default function CrearBilletera() {
  const [monedas, setMonedas] = useState([]);
  const [monedaIdSeleccionada, setMonedaIdSeleccionada] = useState("");
  const [saldo, setSaldo] = useState("");
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const cargarMonedas = async () => {
      try {
        const data = await getAllMonedas(token);
        setMonedas(data);
      } catch (error) {
        console.error("Error al cargar monedas:", error);
      }
    };

    if (token) {
      cargarMonedas();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!monedaIdSeleccionada || !saldo) {
      alert("Por favor selecciona una moneda e ingresa un saldo.");
      return;
    }

    try {
      await crearBilletera(parseInt(monedaIdSeleccionada), parseFloat(saldo), token);
      alert("Billetera creada exitosamente.");
      navigate("/profile"); // Redirige si deseas
    } catch (error) {
      console.error("Error al crear billetera:", error);
      alert("No se pudo crear la billetera.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Crear Billetera</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Selecciona Moneda:</label>
          <select
            value={monedaIdSeleccionada}
            onChange={(e) => setMonedaIdSeleccionada(e.target.value)}
            required
          >
            <option value="">-- Selecciona una moneda --</option>
            {monedas.map((moneda) => (
              <option key={moneda.id} value={moneda.id}>
                {moneda.nombre} ({moneda.codigo})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Saldo inicial:</label>
          <input
            type="number"
            value={saldo}
            onChange={(e) => setSaldo(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </div>

        <button type="submit">Crear Billetera</button>
      </form>
    </div>
  );
}
