// src/components/Layout.jsx
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

export default function Layout() {
  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
