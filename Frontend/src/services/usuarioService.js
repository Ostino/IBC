import axios from "axios";

export const getProfile = async (token) => {
  const response = await axios.get("http://localhost:3000/api/usuarios/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
