import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
// Las siguientes se agregan después:
import Register from "./pages/Register";
import Profile from "./pages/Perfil";
import AdmUsuarios from "./pages/AdmUsuarios";
import AdmMonedas from "./pages/AdmMonenda";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admUsuarios" element={<AdmUsuarios />} />
      <Route path="/admMonedas" element={<AdmMonedas />} />
    </Routes>
  );
}
