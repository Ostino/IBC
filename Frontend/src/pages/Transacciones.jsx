import { useEffect, useState } from "react";
import { getMisTransferencias ,aprobarTransaccion,rechazarTransaccion } from "../services/transaccionService";
import { obtenerUrlImagenComprobante } from "../services/imgeneService";

export default function Transacciones() {
  const [transferencias, setTransferencias] = useState([]);
  const token = sessionStorage.getItem("token");

  const cargarTransferencias = async () => {
    try {
      const data = await getMisTransferencias(token);
      setTransferencias(data);
    } catch (err) {
      console.error("Error al cargar transferencias:", err);
    }
  };

  useEffect(() => {
    if (token) cargarTransferencias();
  }, [token]);

  const handleAprobar = async (id) => {
    try {
      await aprobarTransaccion(id, token);
      await cargarTransferencias();
    } catch (err) {
      console.error("Error al aprobar:", err);
    }
  };

  const handleRechazar = async (id) => {
    try {
      await rechazarTransaccion(id, token);
      await cargarTransferencias();
    } catch (err) {
      console.error("Error al rechazar:", err);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "1rem" }}>
      <h2>Mis Transacciones</h2>
      {transferencias.length === 0 ? (
        <p>No tienes transacciones.</p>
      ) : (
        transferencias.map((t) => (
          <div key={t.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
            <p><strong>Tipo:</strong> {t.tipo}</p>
            <p><strong>Monto:</strong> {t.monto}</p>
            <p><strong>Estado:</strong> {t.estado}</p>
            <p><strong>Divisa:</strong> {t.Anuncio?.divisa}</p>
            <p><strong>Descripción de pago:</strong> {t.descripcionPago}</p>
            <p><strong>Precio por unidad:</strong> {t.Anuncio?.precioPorUnidad}</p>

            {t.comprobantePago && (
              <div style={{ marginTop: "1rem" }}>
                <p><strong>Comprobante:</strong></p>
                <img
                  src={obtenerUrlImagenComprobante(t.comprobantePago)}
                  alt="Comprobante"
                  style={{ width: "100%", maxWidth: "300px", borderRadius: "4px" }}
                />
              </div>
            )}

            {t.estado === "Pendiente" && (
              <div style={{ marginTop: "1rem" }}>
                <button onClick={() => handleAprobar(t.id)} style={{ marginRight: "1rem", backgroundColor: "#d4edda" }}>
                  Aprobar
                </button>
                <button onClick={() => handleRechazar(t.id)} style={{ backgroundColor: "#f8d7da" }}>
                  Rechazar
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}