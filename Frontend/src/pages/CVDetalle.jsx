import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Alert,
  Box,
  Paper,
} from "@mui/material";
import { crearTransaccion } from "../services/transaccionService";
import FondoEstrellas from "../components/FondoEstrellas";

export default function CompraVentaDetalle() {
  const { state } = useLocation();
  const anuncio = state?.anuncio;
  const [comprobante, setComprobante] = useState(null);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!anuncio) return <Typography>No se encontró el anuncio.</Typography>;

  const handleFileChange = (e) => {
    setComprobante(e.target.files[0]);
  };

  const handleTransaccion = async () => {
    setError("");
    setSuccess("");
    if (!comprobante) {
    setError("Por favor adjunte el comprobante");
      return;
    }

    try {
      await crearTransaccion(anuncio.id, comprobante, token);
      setSuccess("Solicitud enviada correctamente");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (error) {
      console.error("Error en la transacción:", error);
      alert("Hubo un error al realizar la transacción.");
    }
  };

  return (
         <>
        <FondoEstrellas />
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3,backgroundColor: "rgba(0, 0, 0, 0.6)",borderRadius: 2,color: "white", }}>
        <Typography variant="h5" gutterBottom>
          Detalle del Anuncio
        </Typography>
{error && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                      </Alert>
                    )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
        <Box sx={{ mb: 2 }}>
          <Typography><strong>Tipo:</strong> {anuncio.tipo}</Typography>
          <Typography><strong>Precio por unidad:</strong> {anuncio.precioPorUnidad}</Typography>
          <Typography><strong>Cantidad:</strong> {anuncio.cantidad}</Typography>
          <Typography><strong>Divisa:</strong> {anuncio.divisa}</Typography>
          <Typography><strong>Descripción de pago:</strong> {anuncio.descripcionPago || "N/A"}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography component="label" htmlFor="comprobante-file" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
            Adjuntar comprobante:
          </Typography>
          <input
            id="comprobante-file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'block', marginBottom: '1rem' }}
          />
        </Box>

        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleTransaccion}
          disabled={!comprobante}
          size="large"
        >
          Hacer Transacción
        </Button>
      </Paper>
    </Container>
         </>
  );
}
