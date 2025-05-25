import axios from "axios";

const BASE_URL = "http://localhost:3000/api/anuncios";

export const getAnunciosPorMonedaYTipo = async (monedaId, tipo, token) => {
  const response = await axios.get(
    `${BASE_URL}/moneda/${monedaId}/${tipo.toLowerCase()}/disponibles`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
