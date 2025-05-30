// src/components/Header.jsx
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#000" ,borderBottom: "2px solid #FFD700",boxShadow: "0 0 10px #FFD700, 0 0 20px #FFD700",}}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1,color: "#FFD700" }}
        >
          IBC
        </Typography>
          <>
            <Button sx={{ color: "#FFD700" }} onClick={() => navigate("/profile")}>
              Perfil
            </Button>
            <Button sx={{ color: "#FFD700" }} onClick={() => navigate("/transacciones")}>
              Transacciones
            </Button>
            <Button sx={{ color: "#FFD700" }} onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </>
      </Toolbar>
    </AppBar>
  );
}
