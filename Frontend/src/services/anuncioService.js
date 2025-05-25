import axios from 'axios';

const API_URL = 'http://localhost:3000/api/anuncios';

export const registrarAnuncio = async (formData, token) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        // NO poner Content-Type, Axios lo maneja solo para FormData
      },
    });
    return response.data;
  } catch (error) {
    // Mejor captura el error para que siempre sea objeto con message
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error(error.message || 'Error desconocido');
  }
};
