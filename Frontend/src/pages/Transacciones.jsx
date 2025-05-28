import { useEffect, useState } from "react";
import {
  getMisTransferencias,
  aprobarTransaccion,
  rechazarTransaccion,
  aprobarTransferencia,
  cancelarTransferencia,
} from "../services/transaccionService";

export default function Transacciones() {
  const [transacciones, setTransacciones] = useState([]);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMisTransferencias(token);
        setTransacciones(data);
      } catch (error) {
        console.error("Error al cargar transferencias:", error);
      }
    };

    fetchData();
  }, [token]);

  const manejarAprobarCompraVenta = async (id) => {
    try {
      await aprobarTransaccion(id,token);
      actualizarEstado(id, "APROBADO");
    } catch (error) {
      console.error("Error al aprobar:", error);
    }
  };

  const manejarCancelarCompraVenta = async (id) => {
    try {
      await rechazarTransaccion(id,token);
      actualizarEstado(id, "CANCELADO");
    } catch (error) {
      console.error("Error al cancelar:", error);
    }
  };

  const manejarAprobarTransferencia = async (id) => {
    try {
      await aprobarTransferencia(id,token);
      actualizarEstado(id, "APROBADO");
    } catch (error) {
      console.error("Error al aprobar transferencia:", error);
    }
  };

  const manejarCancelarTransferencia = async (id) => {
    try {
      await cancelarTransferencia(id,token);
      actualizarEstado(id, "CANCELADO");
    } catch (error) {
      console.error("Error al cancelar transferencia:", error);
    }
  };

  const actualizarEstado = (id, nuevoEstado) => {
    setTransacciones((prev) =>
      prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t))
    );
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h2>Mis Transacciones</h2>
      {transacciones.length === 0 ? (
        <p>No tienes transacciones.</p>
      ) : (
        <ul>
          {transacciones.map((t) => (
            <li key={t.id} style={{ marginBottom: "1.5rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
              <p><strong>ID:</strong> {t.id}</p>
              <p><strong>Tipo:</strong> {t.tipo}</p>
              <p><strong>Monto:</strong> {t.monto}</p>
              <p><strong>Estado:</strong> {t.estado}</p>
              <p><strong>Descripción:</strong> {t.descripcionPago}</p>
              {t.Anuncio && (
                <p><strong>Moneda:</strong> {t.Anuncio.divisa}</p>
              )}
              <p><strong>Comprador ID:</strong> {t.compradorId}</p>
              <p><strong>Vendedor ID:</strong> {t.vendedorId}</p>
              {t.comprobantePago && (
                <div>
                  <p><strong>Comprobante:</strong></p>
                  <img
                    src={`http://localhost:3000/ImagenesComprobantes/${t.comprobantePago}`}
                    alt="Comprobante"
                    style={{ width: "100%", maxWidth: "300px", borderRadius: "4px" }}
                  />
                </div>
              )}

              {/* Botones según tipo y estado */}
              {t.estado === "PENDIENTE" && (
                <>
                  {["COMPRA", "VENTA"].includes(t.tipo) && (
                    <>
                      <button onClick={() => manejarAprobarCompraVenta(t.id)} style={{ marginRight: "1rem" }}>
                        Aprobar
                      </button>
                      <button onClick={() => manejarCancelarCompraVenta(t.id)}>
                        Rechazar
                      </button>
                    </>
                  )}
                  {t.tipo === "TRANSFERENCIA" && (
                    <>
                      <button onClick={() => manejarAprobarTransferencia(t.id)} style={{ marginRight: "1rem" }}>
                        Aprobar
                      </button>
                      <button onClick={() => manejarCancelarTransferencia(t.id)}>
                        Rechazar
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
