import { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {Container,Typography,Button,List,ListItem,ListItemText,Paper,Box,Grid} from "@mui/material";
import { getProfile } from "../services/usuarioService";
import { logoutAll } from "../services/authService";
import { getAllMonedas } from "../services/monedaService";
import { getBilleterasConMonedaUser } from "../services/billeteraService";
import FondoEstrellas from "../components/FondoEstrellas";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [monedas, setMonedas] = useState([]);
  const [billeteras, setBilleteras] = useState([]);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userData = await getProfile(token);
        setUser(userData);
        console.log("Este es el userData ",userData)
        const [todasMonedas, billeterasUsuario] = await Promise.all([
          getAllMonedas(token),
          getBilleterasConMonedaUser(token),
        ]);

        const billeterasConMoneda = billeterasUsuario.map((billetera) => {
          const moneda = todasMonedas.find((m) => m.id === billetera.monedaId);
          return { ...billetera, moneda };
        });

        setMonedas(todasMonedas);
        setBilleteras(billeterasConMoneda);
      } catch (err) {
        if (err.response?.status === 401) {
          sessionStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Error al cargar datos del perfil:", err);
        }
      }
    };

    fetchData();
  }, [navigate, token]);


  const handleLogoutAll = async () => {
    try {
      await logoutAll(token);
    } catch (err) {
      console.error("Error al cerrar todas las sesiones:", err);
    } finally {
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (!user) return <Typography variant="body1" textAlign="center">Cargando perfil...</Typography>;

  return (
     <>
    <FondoEstrellas />
    <Container maxWidth="sm" sx={{padding: 4}}>
      
      <Paper elevation={3} sx={{ p: 3,mb: 4,backgroundColor: "rgba(0, 0, 0, 0.6)",borderRadius: 2,color: "white",}}>
        <Typography variant="h4" gutterBottom>Perfil</Typography>
        <Typography><strong>ID:</strong> {user.id}</Typography>
        <Typography><strong>Usuario:</strong> {user.username}</Typography>
        <Typography><strong>Email:</strong> {user.email}</Typography>

        <Box mt={3}>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <Button
        fullWidth
        variant="contained"
        color="error"
        onClick={handleLogoutAll}
      >
        Cerrar todas las sesiones
      </Button>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Button
        fullWidth
        variant="contained"
        color="ochre"
        onClick={() => navigate("/crear-billetera")}
      >
        Crear billetera
      </Button>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Button
        fullWidth
        variant="contained"
        color="ochre"
        onClick={() => navigate("/registrar-anuncio")}
      >
        Registrar anuncio
      </Button>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Button
        fullWidth
        variant="contained"
        color="success"
        onClick={() => navigate("/crear-transferencia")}
        sx={{ color: "white" }}
      >
        Hacer transferencia
      </Button>
    </Grid>
  </Grid>
</Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3,mb: 4,backgroundColor: "rgba(0, 0, 0, 0.6)",borderRadius: 2,color: "white",}}>
        <Typography variant="h5" gutterBottom>Mis Billeteras</Typography>
        {billeteras.length === 0 ? (
          <Typography>No tienes billeteras.</Typography>
        ) : (
          <List>
  {billeteras.map((b) => (
    <Box
      key={b.id}
      sx={{
        backgroundColor: "#936a4d", // verde oscuro
        borderTop: "6px solid #4caf50", // línea verde
        borderRadius: 2,
        p: 2,
        mb: 2,
        color: "white",
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {b.moneda.nombre} (ID: {b.id})
      </Typography>
      <Typography variant="body2">Saldo: {b.saldo}</Typography>
    </Box>
  ))}
</List>

        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 3,mb: 4,backgroundColor: "rgba(0, 0, 0, 0.6)",borderRadius: 2,color: "white", }}>
  <Typography variant="h5" gutterBottom>Monedas disponibles</Typography>
 <Box display="flex" flexWrap="wrap" gap={2}>
  {monedas.map((moneda) => {
    const tieneBilletera = billeteras.some((b) => b.moneda.id === moneda.id);

    return (
      <Box
        key={moneda.id}
        component={RouterLink}
        to={`/compraventa/${moneda.id}`}
        sx={{
          textDecoration: "none",
          color: "inherit",
          borderRadius: 2,
          padding: 2,
          width: 220,
          backgroundColor: "#c0c0c0",
          borderTop: tieneBilletera ? "6px solid #4caf50" : "6px solid transparent",
          boxShadow: 2,
          transition: "transform 0.2s",
          '&:hover': {
            transform: "scale(1.03)",
            boxShadow: 4
          }
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {moneda.codigo} - {moneda.nombre}
        </Typography>
        <Typography variant="body2">
          1 = {moneda.valueInSus} SUS
        </Typography>
      </Box>
    );
  })}
</Box>
</Paper>
    </Container>
    </>
  );
}

//936a4d