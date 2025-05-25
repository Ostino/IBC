import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnunciosPorMonedaYTipo } from "../services/compraVentaService";

export default function CompraVenta() {
  const { idMoneda } = useParams(); // Este debe venir del <Route path="/compraventa/:idMoneda" />
  const [tipoSeleccionado, setTipoSeleccionado] = useState("compra");
  const [anuncios, setAnuncios] = useState([]);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const cargarAnuncios = async () => {
      try {
        const data = await getAnunciosPorMonedaYTipo(idMoneda, tipoSeleccionado, token);
        setAnuncios(data);
      } catch (error) {
        console.error("Error al cargar anuncios:", error);
      }
    };

    if (token && idMoneda) {
      cargarAnuncios();
    }
  }, [idMoneda, tipoSeleccionado, token]);

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "1rem" }}>
      <h2>Anuncios para moneda #{idMoneda}</h2>
      
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setTipoSeleccionado("compra")}
          style={{ marginRight: "1rem", backgroundColor: tipoSeleccionado === "compra" ? "#d3f9d8" : "#eee" }}
        >
          Compra
        </button>
        <button
          onClick={() => setTipoSeleccionado("venta")}
          style={{ backgroundColor: tipoSeleccionado === "venta" ? "#ffd6d6" : "#eee" }}
        >
          Venta
        </button>
      </div>

      {anuncios.length === 0 ? (
        <p>No hay anuncios disponibles.</p>
      ) : (
        <div>
          {anuncios.map((anuncio) => (
            <div key={anuncio.id} style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem"
            }}>
              <p><strong>Precio por unidad:</strong> {anuncio.precioPorUnidad}</p>
              <p><strong>Cantidad:</strong> {anuncio.cantidad}</p>
              <p><strong>Divisa:</strong> {anuncio.divisa}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
