import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMonedas } from "../services/monedaService";
import {
  crearBilletera,
  getBilleterasConMonedaUser,
} from "../services/billeteraService";
import FondoEstrellas from "../components/FondoEstrellas";

import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Paper,
  Alert,
} from "@mui/material";

export default function CrearBilletera() {
  const [monedas, setMonedas] = useState([]);
  const [monedaIdSeleccionada, setMonedaIdSeleccionada] = useState("");
  const [saldo, setSaldo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const cargarMonedasDisponibles = async () => {
      try {
        const [todasLasMonedas, billeterasUsuario] = await Promise.all([
          getAllMonedas(token),
          getBilleterasConMonedaUser(token),
        ]);

        const monedasUsadas = billeterasUsuario.map((b) => b.monedaId);
        const monedasFiltradas = todasLasMonedas.filter(
          (m) => !monedasUsadas.includes(m.id)
        );
        setMonedas(monedasFiltradas);
      } catch (error) {
        console.error("Error al cargar monedas:", error);
        setError("No se pudieron cargar las monedas.");
      }
    };

    cargarMonedasDisponibles();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!monedaIdSeleccionada) {
      setError("Por favor selecciona una moneda.");
      return;
    }

    if (!saldo || isNaN(saldo) || Number(saldo) < 0) {
      setError("Por favor ingresa un saldo válido mayor o igual a 0.");
      return;
    }

    try {
      await crearBilletera(
        parseInt(monedaIdSeleccionada),
        parseFloat(saldo),
        token
      );
      setSuccess("Billetera creada exitosamente.");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      console.error("Error al crear billetera:", error);
      setError("No se pudo crear la billetera. Intenta de nuevo.");
    }
  };

  return (
    <>
      <FondoEstrellas />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: 2,
            color: "white",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Crear Billetera
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

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="select-moneda-label">
                Selecciona Moneda
              </InputLabel>
              <Select
                labelId="select-moneda-label"
                value={monedaIdSeleccionada}
                label="Selecciona Moneda"
                onChange={(e) => setMonedaIdSeleccionada(e.target.value)}
              >
                <MenuItem value="">
                  <em>-- Selecciona una moneda --</em>
                </MenuItem>
                {monedas.map((moneda) => (
                  <MenuItem key={moneda.id} value={moneda.id}>
                    {moneda.nombre} ({moneda.codigo})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Saldo inicial"
              type="number"
              required
              fullWidth
              margin="normal"
              inputProps={{ min: 0, step: "0.01" }}
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              Crear Billetera
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
