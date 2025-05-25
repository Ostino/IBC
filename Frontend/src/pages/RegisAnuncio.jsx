// RegisAnuncio.jsx
import React, { useState, useEffect } from 'react';
import { getAllMonedas } from '../services/monedaService';
import { registrarAnuncio } from '../services/anuncioService';

const RegistrarAnuncio = () => {
  const [monedas, setMonedas] = useState([]);
  const [monedaSeleccionada, setMonedaSeleccionada] = useState(null);
  const [tipo, setTipo] = useState('COMPRA');
  const [precioPorUnidad, setPrecioPorUnidad] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcionPago, setDescripcionPago] = useState('');
  const [imagenPago, setImagenPago] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    getAllMonedas(token).then(setMonedas);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    if (!monedaSeleccionada) return alert('Selecciona una moneda');

    const formData = new FormData();
    formData.append('monedaId', monedaSeleccionada.id);
    formData.append('divisa', monedaSeleccionada.codigo); // necesario
    formData.append('tipo', tipo);
    formData.append('precioPorUnidad', precioPorUnidad);
    formData.append('cantidad', cantidad);
    formData.append('descripcionPago', descripcionPago);
    if (imagenPago) formData.append('imagenPago', imagenPago);

    try {
      const anuncio = await registrarAnuncio(formData, token);
      console.log('Anuncio creado:', anuncio);
    } catch (err) {
      console.error('Error al crear anuncio:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select onChange={(e) => setMonedaSeleccionada(JSON.parse(e.target.value))}>
        <option value="">Selecciona una moneda</option>
        {monedas.map((m) => (
          <option key={m.id} value={JSON.stringify(m)}>
            {m.nombre}
          </option>
        ))}
      </select>
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="COMPRA">COMPRA</option>
        <option value="VENTA">VENTA</option>
      </select>
      <input type="number" value={precioPorUnidad} onChange={(e) => setPrecioPorUnidad(e.target.value)} placeholder="Precio por unidad" />
      <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Cantidad" />
      <input type="text" value={descripcionPago} onChange={(e) => setDescripcionPago(e.target.value)} placeholder="Descripción de pago" />
      <input type="file" onChange={(e) => setImagenPago(e.target.files[0])} />
      <button type="submit">Registrar anuncio</button>
    </form>
  );
};

export default RegistrarAnuncio;
