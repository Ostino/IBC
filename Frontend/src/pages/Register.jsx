import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await register(
        formData.username,
        formData.email,
        formData.password
      );
      sessionStorage.setItem("token", data.token);
      navigate("/profile"); // Redirige a perfil una vez esté lista
    } catch (err) {
      setError("No se pudo registrar. Verifica los datos.");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Usuario"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Registrarse</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
