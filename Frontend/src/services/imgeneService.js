const BASE_URL = "http://localhost:3000/ImagenesAnuncios";

export const obtenerUrlImagenPago = (nombreImagen) => {
  if (!nombreImagen) return null;
  return `${BASE_URL}/${nombreImagen}`;
};
