import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
// Las siguientes se agregan después:
import Register from "./pages/Register";
import Profile from "./pages/Perfil";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
