import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBilleterasConMonedaUser,
} from "../services/billeteraService";
import { getAllMonedas } from "../services/monedaService";
import { registrarAnuncio } from "../services/anuncioService";

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
} from "@mui/material";

const RegistrarAnuncio = () => {
  const [billeteras, setBilleteras] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [billeteraSeleccionada, setBilleteraSeleccionada] = useState("");
  const [tipo, setTipo] = useState("COMPRA");
  const [precioPorUnidad, setPrecioPorUnidad] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [descripcionPago, setDescripcionPago] = useState("");
  const [imagenPago, setImagenPago] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    Promise.all([getBilleterasConMonedaUser(token), getAllMonedas(token)])
      .then(([billeterasUsuario, monedasSistema]) => {
        setBilleteras(billeterasUsuario);
        setMonedas(monedasSistema);
      })
      .catch((err) => {
        console.error("Error al cargar billeteras o monedas:", err);
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!billeteraSeleccionada) return setError("Selecciona una moneda");
    if (!precioPorUnidad || precioPorUnidad <= 0) return setError("Precio inválido");
    if (!cantidad || cantidad <= 0) return setError("Cantidad inválida");

    const token = sessionStorage.getItem("token");
    const billeteraObj = JSON.parse(billeteraSeleccionada);
    const moneda = monedas.find((m) => m.id === billeteraObj.monedaId);

    const formData = new FormData();
    formData.append("monedaId", billeteraObj.monedaId);
    formData.append("divisa", moneda?.codigo || "");
    formData.append("tipo", tipo);
    formData.append("precioPorUnidad", precioPorUnidad);
    formData.append("cantidad", cantidad);
    formData.append("descripcionPago", descripcionPago);
    if (imagenPago) formData.append("imagenPago", imagenPago);

    try {
      await registrarAnuncio(formData, token);
      navigate("/profile");
    } catch (err) {
      console.error("Error al crear anuncio:", err);
      setError("Error al registrar el anuncio. Intenta de nuevo.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Registrar Anuncio
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          noValidate
          sx={{ mt: 2 }}
        >
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="select-billetera-label">Moneda</InputLabel>
            <Select
              labelId="select-billetera-label"
              value={billeteraSeleccionada}
              label="Moneda"
              onChange={(e) => setBilleteraSeleccionada(e.target.value)}
            >
              <MenuItem value="">
                <em>Selecciona una moneda</em>
              </MenuItem>
              {billeteras.map((b) => {
                const moneda = monedas.find((m) => m.id === b.monedaId);
                const nombreMoneda = moneda ? moneda.nombre : `Moneda ${b.monedaId}`;
                return (
                  <MenuItem key={b.id} value={JSON.stringify(b)}>
                    {nombreMoneda} (Saldo: {b.saldo})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="select-tipo-label">Tipo</InputLabel>
            <Select
              labelId="select-tipo-label"
              value={tipo}
              label="Tipo"
              onChange={(e) => setTipo(e.target.value)}
            >
              <MenuItem value="COMPRA">COMPRA</MenuItem>
              <MenuItem value="VENTA">VENTA</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Precio por unidad"
            type="number"
            required
            fullWidth
            margin="normal"
            value={precioPorUnidad}
            onChange={(e) => setPrecioPorUnidad(e.target.value)}
            inputProps={{ min: 0, step: "0.01" }}
          />

          <TextField
            label="Cantidad"
            type="number"
            required
            fullWidth
            margin="normal"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            inputProps={{ min: 0, step: "0.01" }}
          />

          <TextField
            label="Descripción del pago"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={descripcionPago}
            onChange={(e) => setDescripcionPago(e.target.value)}
          />

          <Box sx={{ mt: 2, mb: 3 }}>
            <InputLabel htmlFor="imagenPago">Imagen de pago (opcional)</InputLabel>
            <input
              id="imagenPago"
              type="file"
              accept="image/*"
              onChange={(e) => setImagenPago(e.target.files[0])}
              style={{ marginTop: 8 }}
            />
            {imagenPago && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {imagenPago.name}
              </Typography>
            )}
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Registrar anuncio
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegistrarAnuncio;
