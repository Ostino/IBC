import axios from "axios";

export async function crearTransferencia(anuncioId, comprobante, token) {
  const formData = new FormData();
  formData.append("anuncioId", anuncioId);
  formData.append("comprobante", comprobante);

  const response = await axios.post(
    "http://localhost:3000/api/transferencias/crear",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
