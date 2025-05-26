// RegisAnuncio.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getBilleterasConMonedaUser } from '../services/billeteraService';
import { getAllMonedas } from '../services/monedaService';
import { registrarAnuncio } from '../services/anuncioService';

const RegistrarAnuncio = () => {
  const [billeteras, setBilleteras] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [billeteraSeleccionada, setBilleteraSeleccionada] = useState(null);
  const [tipo, setTipo] = useState('COMPRA');
  const [precioPorUnidad, setPrecioPorUnidad] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcionPago, setDescripcionPago] = useState('');
  const [imagenPago, setImagenPago] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate("/login");
      return;
    }

    // Cargar billeteras y monedas en paralelo
    Promise.all([
      getBilleterasConMonedaUser(token),
      getAllMonedas(token)
    ]).then(([billeterasUsuario, monedasSistema]) => {
      setBilleteras(billeterasUsuario);
      setMonedas(monedasSistema);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    if (!billeteraSeleccionada) return alert('Selecciona una moneda');

    const moneda = monedas.find(m => m.id === billeteraSeleccionada.monedaId);

    const formData = new FormData();
    console.log(billeteraSeleccionada.monedaId," este es el monedaid")
    formData.append('monedaId', billeteraSeleccionada.monedaId); // ID de la billetera
    formData.append('divisa', moneda?.codigo || '');       // Código de la moneda
    formData.append('tipo', tipo);
    formData.append('precioPorUnidad', precioPorUnidad);
    formData.append('cantidad', cantidad);
    formData.append('descripcionPago', descripcionPago);
    if (imagenPago) formData.append('imagenPago', imagenPago);

    try {
      const anuncio = await registrarAnuncio(formData, token);
      console.log('Anuncio creado:', anuncio);
      // Redirigir o limpiar formulario
    } catch (err) {
      console.error('Error al crear anuncio:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select onChange={(e) => setBilleteraSeleccionada(JSON.parse(e.target.value))}>
        <option value="">Selecciona una moneda</option>
        {billeteras.map((b) => {
          const moneda = monedas.find(m => m.id === b.monedaId);
          const nombreMoneda = moneda ? moneda.nombre : `Moneda ${b.monedaId}`;
          return (
            <option key={b.id} value={JSON.stringify(b)}>
              {nombreMoneda}
            </option>
          );
        })}
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