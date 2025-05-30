// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Perfil";
import AdmUsuarios from "./pages/AdmUsuarios";
import AdmMonedas from "./pages/AdmMonenda";
import RegistrarAnuncio from "./pages/RegisAnuncio";
import CompraVenta from "./pages/CompraVenta";
import CompraVentaDetalle from "./pages/CVDetalle";
import Transacciones from "./pages/Transacciones";
import CrearBilletera from "./pages/CrearBilletera";
import CrearTransferencia from "./pages/CrearTransferencia";
import Layout from "./components/Layout";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: {
      default: '#000000',
      paper: '#121212',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
    ochre: {
      main: '#E3D026',
      light: '#E9DB5D',
      dark: '#A29415',
      contrastText: '#242105',
    },

  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route element={<Layout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/registrar-anuncio" element={<RegistrarAnuncio />} />
        <Route path="/compraventa/:idMoneda" element={<CompraVenta />} />
        <Route path="/compraventa-detalle" element={<CompraVentaDetalle />} />
        <Route path="/transacciones" element={<Transacciones />} />
        <Route path="/crear-billetera" element={<CrearBilletera />} />
        <Route path="/crear-transferencia" element={<CrearTransferencia />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admUsuarios" element={<AdmUsuarios />} />
        <Route path="/admMonedas" element={<AdmMonedas />} />
        <Route path="/registrar-anuncio" element={<RegistrarAnuncio />} />
        <Route path="/compraventa/:idMoneda" element={<CompraVenta />} />
        <Route path="/compraventa-detalle" element={<CompraVentaDetalle />} />
        <Route path="/transacciones" element={<Transacciones />} />
        <Route path="/crear-billetera" element={<CrearBilletera />} />
        <Route path="/crear-transferencia" element={<CrearTransferencia />} />
      </Routes>
    </ThemeProvider>
  );
}
