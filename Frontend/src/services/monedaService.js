import axios from "axios";

const API_URL = "http://localhost:3000/api/monedas";

export const getAllMonedas = async (token) => {
  const response = await axios.get(`${API_URL}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const crearMoneda = async (moneda, token) => {
  const response = await axios.post(API_URL, moneda, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const actualizarMoneda = async (id, moneda, token) => {
  const response = await axios.put(`${API_URL}/${id}`, moneda, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const eliminarMoneda = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};