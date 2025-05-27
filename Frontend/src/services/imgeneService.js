const BASE_URL = "http://localhost:3000/ImagenesAnuncios";

export const obtenerUrlImagenPago = (nombreImagen) => {
  if (!nombreImagen) return null;
  return `http://localhost:3000/ImagenesAnuncios/${nombreImagen}`;
};
export const obtenerUrlImagenComprobante = (nombreImagen) => {
  if (!nombreImagen) return null;
  return `http://localhost:3000/ImagenesComprobantes/${nombreImagen}`;
};