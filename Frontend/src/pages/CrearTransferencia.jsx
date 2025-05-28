import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearTransferencia } from "../services/transaccionService";
import { getBilleterasConMonedaUser } from "../services/billeteraService";
import { getAllMonedas } from "../services/monedaService";

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
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Crear Transferencia
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          noValidate
          sx={{ mt: 2 }}
        >
          <TextField
            label="Monto"
            type="number"
            required
            fullWidth
            margin="normal"
            value={formData.monto}
            onChange={(e) =>
              setFormData({ ...formData, monto: e.target.value })
            }
            inputProps={{ min: 0, step: "0.01" }}
          />

          <TextField
            label="Descripción del pago"
            required
            fullWidth
            margin="normal"
            value={formData.descripcionPago}
            onChange={(e) =>
              setFormData({ ...formData, descripcionPago: e.target.value })
            }
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="de-billetera-label">De billetera</InputLabel>
            <Select
              labelId="de-billetera-label"
              value={formData.deBilleteraId}
              label="De billetera"
              onChange={(e) =>
                setFormData({ ...formData, deBilleteraId: e.target.value })
              }
            >
              <MenuItem value="">
                <em>Seleccione una billetera</em>
              </MenuItem>
              {misBilleteras.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.moneda?.nombre || "Moneda desconocida"} (Saldo: {b.saldo})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Hacia billetera (ID)"
            required
            fullWidth
            margin="normal"
            value={formData.haciaBilleteraId}
            onChange={(e) =>
              setFormData({ ...formData, haciaBilleteraId: e.target.value })
            }
          />

          <Box sx={{ mt: 2, mb: 3 }}>
            <InputLabel htmlFor="comprobantePago" required>
              Comprobante de pago
            </InputLabel>
            <input
              id="comprobantePago"
              type="file"
              accept="image/*"
              required
              onChange={(e) =>
                setFormData({ ...formData, comprobantePago: e.target.files[0] })
              }
              style={{ marginTop: 8 }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Enviar Transferencia
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
