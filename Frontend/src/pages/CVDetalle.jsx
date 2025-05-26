import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { crearTransferencia } from "../services/transferenciaService";
export default function CompraVentaDetalle() {
  const { state } = useLocation(); // el anuncio se pasa desde navigate con state
  const anuncio = state?.anuncio;
  const [comprobante, setComprobante] = useState(null);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  if (!anuncio) return <p>No se encontró el anuncio.</p>;

  const handleFileChange = (e) => {
    setComprobante(e.target.files[0]);
  };

  const handleTransaccion = async () => {
    if (!comprobante) {
      alert("Debe adjuntar una imagen comprobante.");
      return;
    }

    try {
      console.log(anuncio.id,"anuncio id ", token, "token")
      await crearTransferencia(anuncio.id, comprobante, token);
      alert("Transacción realizada con éxito.");
      navigate("/perfil");
    } catch (error) {
      console.error("Error en la transacción:", error);
      alert("Hubo un error al realizar la transacción.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem" }}>
      <h2>Detalle del Anuncio</h2>
      <p><strong>Tipo:</strong> {anuncio.tipo}</p>
      <p><strong>Precio por unidad:</strong> {anuncio.precioPorUnidad}</p>
      <p><strong>Cantidad:</strong> {anuncio.cantidad}</p>
      <p><strong>Divisa:</strong> {anuncio.divisa}</p>
      <p><strong>Descripción de pago:</strong> {anuncio.descripcionPago || "N/A"}</p>

      <div style={{ marginTop: "1rem" }}>
        <label><strong>Adjuntar comprobante:</strong></label><br />
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <button
        onClick={handleTransaccion}
        style={{ marginTop: "1rem", backgroundColor: "#4caf50", color: "#fff", padding: "0.5rem 1rem" }}
      >
        Hacer Transacción
      </button>
    </div>
  );
}
