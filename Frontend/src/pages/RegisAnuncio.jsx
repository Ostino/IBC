import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBilleterasConMonedaUser,
} from "../services/billeteraService";
import { getAllMonedas } from "../services/monedaService";
import { registrarAnuncio } from "../services/anuncioService";

import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
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

    if (!billeteraSeleccionada) {
      setError("Selecciona una moneda");
      return;
    }

    if (!precioPorUnidad || precioPorUnidad <= 0) {
      setError("Ingresa un precio por unidad válido");
      return;
    }

    if (!cantidad || cantidad <= 0) {
      setError("Ingresa una cantidad válida");
      return;
    }

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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Registrar Anuncio
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <FormControl fullWidth margin="normal">
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
                  {nombreMoneda}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
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
          fullWidth
          type="number"
          label="Precio por unidad"
          value={precioPorUnidad}
          onChange={(e) => setPrecioPorUnidad(e.target.value)}
          margin="normal"
          inputProps={{ min: 0, step: "any" }}
          required
        />

        <TextField
          fullWidth
          type="number"
          label="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          margin="normal"
          inputProps={{ min: 0, step: "any" }}
          required
        />

        <TextField
          fullWidth
          label="Descripción de pago"
          value={descripcionPago}
          onChange={(e) => setDescripcionPago(e.target.value)}
          margin="normal"
          multiline
          rows={2}
        />

        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          {imagenPago ? "Cambiar imagen de pago" : "Subir imagen de pago"}
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => setImagenPago(e.target.files[0])}
          />
        </Button>
        {imagenPago && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {imagenPago.name}
          </Typography>
        )}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Registrar anuncio
        </Button>
      </Box>
    </Container>
  );
};

export default RegistrarAnuncio;
