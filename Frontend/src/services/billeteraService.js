import axios from "axios";
const BILLETERAS_URL = "http://localhost:3000/api/billeteras";

export const getBilletera = async (token) => {
  const response = await axios.get(BILLETERAS_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};