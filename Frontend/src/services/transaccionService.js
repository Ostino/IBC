import axios from "axios";
const API_URL = "http://localhost:3000/api/transacciones";

export async function crearTransaccion(anuncioId, comprobante, token) {
  const formData = new FormData();
  formData.append("anuncioId", anuncioId);
  formData.append("comprobante", comprobante);

  const response = await axios.post(
    `${API_URL}/crear`,
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
export const getMisTransferencias = async (token) => {
  const response = await axios.get(`${API_URL}/mias`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
//http://localhost:3000/api/transacciones/transacciones/:id/aprobar
//http://localhost:3000/api/transacciones/transacciones/:id/cancelar
export const aprobarTransaccion = async (id, token) => {
  const res = await axios.patch(`${API_URL}/transacciones/${id}/aprobar`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const rechazarTransaccion = async (id, token) => {
  const res = await axios.patch(`${API_URL}/transacciones/${id}/cancelar`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const crearTransferencia = async (formData, token) => {
  const response = await axios.post(`${API_URL}/crear/transferencia`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const aprobarTransferencia = async (id, token) => {
  console.log("id: ",id,"token :",token)
const res = await axios.patch(`${API_URL}/transferencia/${id}/aprobar`, null, {
headers: { Authorization: `Bearer ${token}` },
});
return res.data;
};

export const cancelarTransferencia = async (id, token) => {
const res = await axios.patch(`${API_URL}/transferencia/${id}/cancelar`, null, {
headers: { Authorization: `Bearer ${token}` },
});
return res.data;
};