import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
} from "@mui/material";

import { getAnunciosPorMonedaYTipo } from "../services/compraVentaService";
import { obtenerUrlImagenPago } from "../services/imgeneService";
import { getAllMonedas } from "../services/monedaService";  // Importa getAllMonedas
import FondoEstrellas from "../components/FondoEstrellas";

export default function CompraVenta() {
  const { idMoneda } = useParams();
  const [moneda, setMoneda] = useState(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("compra");
  const [anuncios, setAnuncios] = useState([]);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchMoneda = async () => {
      try {
        const monedas = await getAllMonedas(token);
        const monedaEncontrada = monedas.find(m => m.id === parseInt(idMoneda));
        setMoneda(monedaEncontrada || null);
      } catch (error) {
        console.error("Error al obtener moneda:", error);
      }
    };

    const cargarAnuncios = async () => {
      try {
        const data = await getAnunciosPorMonedaYTipo(idMoneda, tipoSeleccionado, token);
        setAnuncios(data);
      } catch (error) {
        console.error("Error al cargar anuncios:", error);
      }
    };

    if (token && idMoneda) {
      fetchMoneda();
      cargarAnuncios();
    }
  }, [idMoneda, tipoSeleccionado, token, navigate]);

  return (
         <>
        <FondoEstrellas />
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Anuncios de : {moneda ? moneda.nombre : `#${idMoneda}`}
      </Typography>

      {/* Botones de tipo */}
      <ButtonGroup variant="contained" sx={{ mb: 3 }}>
        <Button
          onClick={() => setTipoSeleccionado("compra")}
          color={tipoSeleccionado === "compra" ? "success" : "inherit"}
        >
          Compra
        </Button>
        <Button
          onClick={() => setTipoSeleccionado("venta")}
          color={tipoSeleccionado === "venta" ? "error" : "inherit"}
        >
          Venta
        </Button>
      </ButtonGroup>

      {/* Lista de anuncios */}
      {anuncios.length === 0 ? (
        <Typography variant="body1">No hay anuncios disponibles.</Typography>
      ) : (
        <Grid container spacing={3}>
          {anuncios.map((anuncio) => (
            <Grid item xs={12} sm={6} key={anuncio.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" ,backgroundColor: "rgba(31, 30, 30, 0.6)",borderRadius: 2,color: "white",}}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {anuncio.divisa}
                  </Typography>
                  <Typography variant="body2"><strong>Precio por unidad:</strong> {anuncio.precioPorUnidad}</Typography>
                  <Typography variant="body2"><strong>Cantidad:</strong> {anuncio.cantidad}</Typography>
                </CardContent>

                {anuncio.imagenPago && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={obtenerUrlImagenPago(anuncio.imagenPago)}
                    alt="Como pagar"
                    sx={{ objectFit: "contain", p: 1 }}
                  />
                )}

                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate("/compraventa-detalle", { state: { anuncio } })}
                  >
                    Ver Detalle
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
    </>
  );
}
