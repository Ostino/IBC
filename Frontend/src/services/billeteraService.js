import axios from "axios";
const BILLETERAS_URL = "http://localhost:3000/api/billeteras";

export const getBilleterasConMonedaUserId = async (token,id) => {
  const response = await axios.get(`${BILLETERAS_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const getBilleterasConMonedaUser = async (token) => {
  const response = await axios.get(`${BILLETERAS_URL}/mes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
