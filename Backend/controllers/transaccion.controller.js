const { Transaccion, Anuncio, Billetera, Usuario } = require('../models');
const fs = require('fs');
const path = require('path');

const getBilleteraDelUsuarioPorMoneda = async (usuarioId, monedaId) => {
  const billeteras = await Billetera.findAll({
    where: { usuarioId }
  });
  console.log('🔍 Billeteras del usuario:', billeteras.map(b => ({ id: b.id, monedaId: b.monedaId })));
  console.log('🎯 monedaId del anuncio:', monedaId);
  const billeteraEncontrada = billeteras.find(b => b.monedaId === monedaId);

  if (!billeteraEncontrada) {
    throw new Error("No se encontró la billetera del usuario con la moneda especificada");
  }

  return billeteraEncontrada;
};

const crearTransferencia = async (req, res) => {
  console.log('📥 anuncioId recibido:', req.body.anuncioId);
  try {
    const { anuncioId } = req.body;
    const comprobante = req.file; // imagen

    if (!comprobante) {
      return res.status(400).json({ error: 'Debes subir una imagen de comprobante' });
    }

    const anuncios = await Anuncio.findByPk(anuncioId, {include: [{ model: Billetera, model: Usuario,model:Transaccion }]});


    if (!anuncios) {
      return res.status(404).json({ error: 'Anuncio no encontrado' });
    }

    // Extraer datos del anuncio
    const vendedorId = anuncios.UsuarioId;
    const descripcionPago = anuncios.descripcionPago;
    const precioPorUnidad = anuncios.precioPorUnidad;
    const cantidad = anuncios.cantidad;
    const monto = precioPorUnidad * cantidad;
    const tipo = anuncios.tipo;
    const monedaId = anuncios.MonedaId;

    // Comprador
    const compradorId = req.user.id;

    // Obtener deBilleteraId del comprador
      console.log('🎯 monedaId del comprador:', monedaId);

    const deBilletera = await getBilleteraDelUsuarioPorMoneda(compradorId, monedaId);

    // Obtener haciaBilleteraId del vendedor
      console.log('🎯 monedaId del vendedor:', monedaId);

    const haciaBilletera = await getBilleteraDelUsuarioPorMoneda(vendedorId, monedaId);


    const nuevaTransferencia = await Transaccion.create({
      AnuncioId :anuncioId,
      vendedorId,
      compradorId,
      monto,
      descripcionPago,
      tipo,
      comprobantePago: 'temporal',
      deBilleteraId: deBilletera.id,
      haciaBilleteraId: haciaBilletera.id,
      estado: 'Pendiente'
    });
    // Renombrar imagen a: idTransaccion_nombreOriginal.ext
    const ext = path.extname(comprobante.originalname);
    const nuevoNombre = `${nuevaTransferencia.id}_${comprobante.originalname}`;
    const nuevaRuta = path.join(
      path.dirname(comprobante.path),
      nuevoNombre
    );

    fs.renameSync(comprobante.path, nuevaRuta);

    // Actualizar transacción con el nombre correcto del archivo
    nuevaTransferencia.comprobantePago = nuevoNombre;

    await nuevaTransferencia.save();

    res.status(201).json({ message: 'Transferencia creada con éxito', transferencia: nuevaTransferencia });
  } catch (error) {
    console.error('Error al crear transferencia:', error);
    res.status(500).json({ error: 'Error al crear transferencia', details: error.message });
  }
};
const getTodasLasTransferencias = async (req, res) => {
  try {
    const transferencias = await Transaccion.findAll({model: Usuario});
    res.json(transferencias);
  } catch (error) {
    console.error('Error al obtener transferencias:', error);
    res.status(500).json({ error: 'Error al obtener transferencias' });
  }
};
const getMisTransferencias = async (req, res) => {
  try {
    const userId = req.user.id;

    const transferencias = await Transaccion.findAll({
      where: {
        [Op.or]: [
          { compradorId: userId },
          { vendedorId: userId }
        ]
      },
      include: ['anuncio', 'deBilletera', 'haciaBilletera']
    });

    res.json(transferencias);
  } catch (error) {
    console.error('Error al obtener mis transferencias:', error);
    res.status(500).json({ error: 'Error al obtener tus transferencias' });
  }
};
const getTransferenciasPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const transferencias = await Transaccion.findAll({
      where: {
        [Op.or]: [
          { compradorId: id },
          { vendedorId: id }
        ]
      },
      include: ['anuncio', 'deBilletera', 'haciaBilletera']
    });

    res.json(transferencias);
  } catch (error) {
    console.error('Error al obtener transferencias del usuario:', error);
    res.status(500).json({ error: 'Error al obtener transferencias del usuario' });
  }
};

module.exports = {
  crearTransferencia,
  getMisTransferencias,
  getTodasLasTransferencias,
  getTransferenciasPorUsuario
};