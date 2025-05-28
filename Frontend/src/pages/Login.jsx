import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { token, user } = await login(email, password);
      sessionStorage.setItem("token", token);
      if (user.rol === 1) {
        navigate("/admUsuarios");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Iniciar sesión
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
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
          Iniciar sesión
        </Button>
      </Box>

      <Button
        variant="text"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => navigate("/register")}
      >
        ¿No tienes cuenta? Regístrate
      </Button>
    </Container>
  );
}
