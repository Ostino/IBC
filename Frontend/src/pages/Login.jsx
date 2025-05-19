import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token ,user} = await login(email, password);
      sessionStorage.setItem("token", token);
      if (user.rol === 1) {
      navigate("/admUsuarios");
    } else {
      navigate("/profile");
    }
    } catch (err) {
      alert("Credenciales inválidas");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar sesión</button>
      </form>
      <button onClick={() => navigate("/register")} style={{ marginTop: "1rem" }}>
        ¿No tienes cuenta? Regístrate
      </button>
    </div>
  );
}
