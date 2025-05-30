import { useEffect, useState } from "react";
import {getMisTransferencias,aprobarTransaccion,rechazarTransaccion,
  aprobarTransferencia,cancelarTransferencia,} from "../services/transaccionService";
import {Container,Typography,List,ListItem,ListItemText,Button,Box,Paper,} from "@mui/material";
import FondoEstrellas from "../components/FondoEstrellas";

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

  const actualizarEstado = (id, nuevoEstado) => {
    setTransacciones((prev) =>
      prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t))
    );
  };

  const manejarAprobarCompraVenta = async (id) => {
    try {
      await aprobarTransaccion(id, token);
      actualizarEstado(id, "APROBADO");
    } catch (error) {
      console.error("Error al aprobar:", error);
    }
  };

  const manejarCancelarCompraVenta = async (id) => {
    try {
      await rechazarTransaccion(id, token);
      actualizarEstado(id, "CANCELADO");
    } catch (error) {
      console.error("Error al cancelar:", error);
    }
  };

  const manejarAprobarTransferencia = async (id) => {
    try {
      await aprobarTransferencia(id, token);
      actualizarEstado(id, "APROBADO");
    } catch (error) {
      console.error("Error al aprobar transferencia:", error);
    }
  };

  const manejarCancelarTransferencia = async (id) => {
    try {
      await cancelarTransferencia(id, token);
      actualizarEstado(id, "CANCELADO");
    } catch (error) {
      console.error("Error al cancelar transferencia:", error);
    }
  };

  return (
     <>
        <FondoEstrellas />
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mis Transacciones
      </Typography>

      {transacciones.length === 0 ? (
        <Typography variant="body1">No tienes transacciones.</Typography>
      ) : (
        <List>
          {transacciones.map((t) => (
            <Paper key={t.id} sx={{ p: 2, mb: 2,backgroundColor: "rgba(0, 0, 0, 0.6)",borderRadius: 2,color: "white", }}>
              <ListItem alignItems="flex-start" disableGutters>
                <ListItemText
                  primary={`ID: ${t.id} — Tipo: ${t.tipo} — Estado: ${t.estado}`}
                  secondary={
                    <>
                      <Typography variant="body2" color="white">
                        Monto: {t.monto}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Descripción: {t.descripcionPago}
                      </Typography>
                      {t.Anuncio && (
                        <Typography variant="body2" color="white">
                          Moneda: {t.Anuncio.divisa}
                        </Typography>
                      )}
                      <Typography variant="body2" color="white">
                        Comprador ID: {t.compradorId}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Vendedor ID: {t.vendedorId}
                      </Typography>
                      {t.comprobantePago && (
                        <Box mt={2}>
                          <Typography variant="body2" fontWeight="bold" color="white" gutterBottom>
                            Comprobante:
                          </Typography>
                          <img
                            src={`http://localhost:3000/ImagenesComprobantes/${t.comprobantePago}`}
                            alt="Comprobante"
                            style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 4 }}
                          />
                        </Box>
                      )}
                    </>
                  }
                />
              </ListItem>

              {t.estado === "PENDIENTE" && (
                <Box mt={2} display="flex" gap={2}color="white">
                  {["COMPRA", "VENTA"].includes(t.tipo) && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => manejarAprobarCompraVenta(t.id)}
                      >
                        Aprobar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => manejarCancelarCompraVenta(t.id)}
                      >
                        Rechazar
                      </Button>
                    </>
                  )}

                  {t.tipo === "TRANSFERENCIA" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => manejarAprobarTransferencia(t.id)}
                      >
                        Aprobar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => manejarCancelarTransferencia(t.id)}
                      >
                        Rechazar
                      </Button>
                    </>
                  )}
                </Box>
              )}
            </Paper>
          ))}
        </List>
      )}
    </Container>
     </>
  );
}
