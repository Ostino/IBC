import axios from "axios";

const API_URL = 'http://localhost:3000/api/usuarios';

export const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const getAllUsers = async (token) => {
  const response = await axios.get(`${API_URL}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const promoteToAdmin = async (id, token) => {
  console.log("Promoviendo usuario ID:", id);
  console.log("Usando token:", token);
  console.log("URL:", `${API_URL}/admin/${id}`);

  try {
    const response = await axios.put(`${API_URL}/admin/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al promover al usuario:", error);
    throw error;
  }
};