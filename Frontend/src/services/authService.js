import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};
export const register = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password
  });
  return response.data;
};
export const logout = async (token) => {
  await axios.post(`${API_URL}/logout`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const logoutAll = async (token) => {
  await axios.post(`${API_URL}/logoutAll`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};