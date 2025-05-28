import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearTransferencia } from "../services/transaccionService";
import { getBilleterasConMonedaUser } from "../services/billeteraService";
import { getAllMonedas } from "../services/monedaService";
export default function CrearTransferencia() {
  const [formData, setFormData] = useState({
    tipo: "TRANSFERENCIA",
    monto: "",
    descripcionPago: "",
    deBilleteraId: "",
    haciaBilleteraId: "",
    comprobantePago: null,
  });

  const [misBilleteras, setMisBilleteras] = useState([]);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

useEffect(() => {
  const cargarBilleteras = async () => {
    try {
      const [billeteras, monedas] = await Promise.all([
        getBilleterasConMonedaUser(token),
        getAllMonedas(token),
      ]);

      const billeterasConMoneda = billeteras.map((b) => {
        const moneda = monedas.find((m) => m.id === b.monedaId);
        return { ...b, moneda };
      });

      setMisBilleteras(billeterasConMoneda);
    } catch (error) {
      console.error("Error al cargar billeteras o monedas:", error);
    }
  };

  if (token) cargarBilleteras();
}, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("tipo", formData.tipo);
    data.append("monto", formData.monto);
    data.append("descripcionPago", formData.descripcionPago);
    data.append("deBilleteraId", formData.deBilleteraId);
    data.append("haciaBilleteraId", formData.haciaBilleteraId);
    if (formData.comprobantePago) {
      data.append("comprobantePago", formData.comprobantePago);
    }

    try {
      await crearTransferencia(data, token);
      alert("Transferencia creada exitosamente");
      navigate("/transacciones");
    } catch (err) {
      console.error("Error al crear transferencia:", err);
      alert("Error al crear la transferencia");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Crear Transferencia</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Monto:
          <input
            type="number"
            value={formData.monto}
            onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
            required
          />
        </label>
        <br /><br />

        <label>
          Descripción del pago:
          <input
            type="text"
            value={formData.descripcionPago}
            onChange={(e) => setFormData({ ...formData, descripcionPago: e.target.value })}
            required
          />
        </label>
        <br /><br />

        <label>
          De billetera:
          <select
            value={formData.deBilleteraId}
            onChange={(e) => setFormData({ ...formData, deBilleteraId: e.target.value })}
            required
          >
            <option value="">Seleccione una billetera</option>
            {misBilleteras.map((b) => (
  <option key={b.id} value={b.id}>
    {b.moneda?.nombre || "Moneda desconocida"} (Saldo: {b.saldo})
  </option>
))}

          </select>
        </label>
        <br /><br />

        <label>
          Hacia billetera (ID):
          <input
            type="text"
            value={formData.haciaBilleteraId}
            onChange={(e) => setFormData({ ...formData, haciaBilleteraId: e.target.value })}
            required
          />
        </label>
        <br /><br />

        <label>
          Comprobante de pago:
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, comprobantePago: e.target.files[0] })
            }
            required
          />
        </label>
        <br /><br />

        <button type="submit">Enviar Transferencia</button>
      </form>
    </div>
  );
}
