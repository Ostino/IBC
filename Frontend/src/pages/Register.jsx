import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { token } = await register(username, email, password);
      sessionStorage.setItem("token", token);
      navigate("/profile");
    } catch (err) {
      setError("Error al registrar usuario");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Registro
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Usuario"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          label="Correo"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Registrarse
        </Button>
      </Box>

      <Button
        variant="text"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => navigate("/login")}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Button>
    </Container>
  );
}
