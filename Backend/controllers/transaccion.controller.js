const { Transaccion, Anuncio, Billetera, Usuario,Moneda } = require('../models');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

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

const buscarTransaccionPorId = async (id) => {
  try {
    const transaccion = await Transaccion.findByPk(id, {
      include: [
        { model: Anuncio },
        { model: Billetera, as: 'deBilletera' },
        { model: Billetera, as: 'haciaBilletera' },
        { model: Usuario, as: 'comprador' },
        { model: Usuario, as: 'vendedor' }
      ]
    });

    return transaccion; 
  } catch (error) {
    console.error('Error al buscar transacción por ID:', error);
    throw error;
  }
};

const hacerTransaccion = async (transaccion) => {
  const monto = transaccion.monto;

  const billeteraOrigen = transaccion.deBilletera;
  const billeteraDestino = transaccion.haciaBilletera;

  if (!billeteraOrigen || !billeteraDestino) {
    throw new Error('Faltan datos de billetera para realizar la transacción.');
  }

  if (billeteraOrigen.saldo < monto) {
    throw new Error('Saldo insuficiente en la billetera de origen.');
  }

  billeteraOrigen.saldo -= monto;
  billeteraDestino.saldo += monto;

  await Promise.all([
    billeteraOrigen.save(),
    billeteraDestino.save()
  ]);

  return {
    mensaje: 'Transacción realizada con éxito',
    deBilletera: billeteraOrigen,
    haciaBilletera: billeteraDestino
  };
};

const crearTransaccion = async (req, res) => {
  console.log('📥 anuncioId recibido:', req.body.anuncioId);
  try {
    const { anuncioId } = req.body;
    const comprobante = req.file;

    if (!comprobante) {
      return res.status(400).json({ error: 'Debes subir una imagen de comprobante' });
    }

    const anuncios = await Anuncio.findByPk(anuncioId, {include: [{ model: Billetera, model: Usuario,model:Transaccion }]});


    if (!anuncios) {
      return res.status(404).json({ error: 'Anuncio no encontrado' });
    }

    const vendedorId = anuncios.UsuarioId;
    const descripcionPago = anuncios.descripcionPago;
    const precioPorUnidad = anuncios.precioPorUnidad;
    const cantidad = anuncios.cantidad;
    const monto = precioPorUnidad * cantidad;
    const tipo = anuncios.tipo;
    const monedaId = anuncios.MonedaId;

    const compradorId = req.user.id;

      console.log('🎯 monedaId del comprador:', monedaId);

    const deBilletera = await getBilleteraDelUsuarioPorMoneda(compradorId, monedaId);

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
      estado: 'PENDIENTE'
    });
    const ext = path.extname(comprobante.originalname);
    const nuevoNombre = `${nuevaTransferencia.id}_${comprobante.originalname}`;
    const nuevaRuta = path.join(
      path.dirname(comprobante.path),
      nuevoNombre
    );

    fs.renameSync(comprobante.path, nuevaRuta);

    nuevaTransferencia.comprobantePago = nuevoNombre;

    await nuevaTransferencia.save();

    res.status(201).json({ message: 'Transferencia creada con éxito', transferencia: nuevaTransferencia });
  } catch (error) {
    console.error('Error al crear transferencia:', error);
    res.status(500).json({ error: 'Error al crear transferencia', details: error.message });
  }
};

const getTodasLasTransacciones = async (req, res) => {
  try {
    const transferencias = await Transaccion.findAll({model: Usuario});
    res.json(transferencias);
  } catch (error) {
    console.error('Error al obtener transferencias:', error);
    res.status(500).json({ error: 'Error al obtener transferencias' });
  }
};

const getMisTransacciones = async (req, res) => {
  try {
    const userId = req.user.id;

    const transferencias = await Transaccion.findAll({
      where: {
        [Op.or]: [
          { compradorId: userId },
          { vendedorId: userId }
        ]
      },
      include: ['Anuncio', 'deBilletera', 'haciaBilletera']
    });

    res.json(transferencias);
  } catch (error) {
    console.error('Error al obtener mis transferencias:', error);
    res.status(500).json({ error: 'Error al obtener tus transferencias' });
  }
};

const getTransaccionesPorUsuario = async (req, res) => {
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

const getTransaccionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const transaccion = await Transaccion.findByPk(id, {
      include: [
        { model: Anuncio },
        { model: Billetera, as: 'deBilletera' },
        { model: Billetera, as: 'haciaBilletera' },
        { model: Usuario, as: 'comprador' },
        { model: Usuario, as: 'vendedor' }
      ]
    });

    if (!transaccion) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    res.json(transaccion);
  } catch (error) {
    console.error('Error al obtener la transacción:', error);
    res.status(500).json({ error: 'Error al obtener la transacción' });
  }
};

const aprobarTransaccion = async (req, res) => {
  try {
    console.log(req.params)
    const { id } = req.params;
    const transaccion = await buscarTransaccionPorId(id);
    if (!transaccion) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }
        console.log(transaccion.estado," este es el estado de la transaccion")

    if (transaccion.estado !== 'PENDIENTE') {
      return res.status(400).json({ error: 'La transacción ya fue procesada' });
    }

    await hacerTransaccion(transaccion);

    transaccion.estado = 'ACEPTADO';
    await transaccion.save();

    res.json({ mensaje: 'Transacción aprobada y ejecutada con éxito', transaccion });
  } catch (error) {
    console.error('Error al aprobar transacción:', error);
    res.status(500).json({ error: error.message });
  }
};

const cancelarTransaccion = async (req, res) => {
  try {
    const { id } = req.params;

    const transaccion = await Transaccion.findByPk(id);

    if (!transaccion) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    transaccion.estado = 'CANCELADO';
    await transaccion.save();

    res.json({ message: 'Transacción cancelada correctamente', transaccion });
  } catch (error) {
    console.error('Error al cancelar transacción:', error);
    res.status(500).json({ error: 'Error al cancelar la transacción' });
  }
};

const crearTransferencia = async (req, res) => {
  try {
    const {
      monto,
      descripcionPago,
      deBilleteraId,
      haciaBilleteraId
    } = req.body;

    const compradorId = req.user.id;

    const billeteraDestino = await Billetera.findByPk(haciaBilleteraId);
    if (!billeteraDestino) {
      return res.status(404).json({ error: 'Billetera destino no encontrada' });
    }

    const vendedorId = billeteraDestino.usuarioId;

    const transaccion = await Transaccion.create({
      tipo: 'TRANSFERENCIA',
      monto,
      descripcionPago,
      deBilleteraId,
      haciaBilleteraId,
      compradorId,
      vendedorId
    });

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const nuevoNombre = `${transaccion.id}_comprobante${ext}`;
      const nuevaRuta = path.join('ImagenesComprobante', nuevoNombre);

      fs.renameSync(req.file.path, nuevaRuta);

      transaccion.comprobantePago = nuevoNombre;
      await transaccion.save();
    }

    res.status(201).json(transaccion);
  } catch (error) {
    console.error('Error al crear transferencia:', error);
    res.status(500).json({ error: 'Error al crear transferencia' });
  }
};

const rechazarTransferencia = async (req, res) => {
  const { id } = req.params;

  try {
    const transaccion = await Transaccion.findByPk(id);
    if (!transaccion) {
      return res.status(404).json({ error: 'Transferencia no encontrada' });
    }

    transaccion.estado = 'CANCELADO';
    await transaccion.save();

    res.json({ mensaje: 'Transferencia cancelada', transaccion });
  } catch (error) {
    console.error('Error al cancelar transferencia:', error);
    res.status(500).json({ error: 'Error al cancelar transferencia' });
  }
};

const aprobarTransferencia = async (req, res) => {
  const { id } = req.params;
  console.log("Iniciando aprobación de transferencia con ID:", id);

  try {
    const transaccion = await Transaccion.findByPk(id, {
      include: [
        {
          model: Billetera,
          as: 'deBilletera',
          include: [Moneda],
        },
        {
          model: Billetera,
          as: 'haciaBilletera',
          include: [Moneda],
        },
      ],
    });

    if (!transaccion) {
      return res.status(404).json({ error: 'Transferencia no encontrada' });
    }

    if (transaccion.estado !== 'PENDIENTE') {
      return res.status(400).json({ error: 'La transferencia ya ha sido procesada' });
    }

    const deBilletera = transaccion.deBilletera;
    const haciaBilletera = transaccion.haciaBilletera;

    if (!deBilletera || !haciaBilletera) {
      return res.status(400).json({ error: 'No se pudo encontrar alguna de las billeteras asociadas' });
    }

    let montoFinal = Number(transaccion.monto);
    const montoOriginal = Number(transaccion.monto);

    if (deBilletera.monedaId !== haciaBilletera.monedaId) {
      const monedaOrigen = deBilletera.Moneda;
      const monedaDestino = haciaBilletera.Moneda;

      if (!monedaOrigen || !monedaDestino) {
        return res.status(400).json({ error: 'No se pudo obtener datos de las monedas' });
      }

      const valorOrigen = Number(monedaOrigen.valueInSus);
      const valorDestino = Number(monedaDestino.valueInSus);

      if (isNaN(valorOrigen) || isNaN(valorDestino)) {
        return res.status(400).json({ error: 'Valores de conversión inválidos' });
      }

      montoFinal = (montoOriginal * valorOrigen) / valorDestino;

      console.log("Monto convertido:", montoFinal);
    }

    if (deBilletera.saldo < montoOriginal) {
      return res.status(400).json({ error: 'Saldo insuficiente en la billetera de origen' });
    }

    deBilletera.saldo -= montoOriginal;
    haciaBilletera.saldo += montoFinal;

    console.log("Nuevo saldo en billetera origen:", deBilletera.saldo);
    console.log("Nuevo saldo en billetera destino:", haciaBilletera.saldo);

    await deBilletera.save();
    await haciaBilletera.save();

    transaccion.estado = 'APROBADO';
    await transaccion.save();

    console.log("Transferencia aprobada y guardada");

    res.json({ mensaje: 'Transferencia aprobada con éxito', transaccion });
  } catch (error) {
    console.error('❌ Error al aprobar transferencia:', error);
    res.status(500).json({ error: 'Error al aprobar transferencia' });
  }
};

module.exports = {
  crearTransaccion,
  getMisTransacciones,
  getTodasLasTransacciones,
  getTransaccionesPorUsuario,
  aprobarTransaccion,
  cancelarTransaccion,
  getTransaccionPorId,
  crearTransferencia,
  rechazarTransferencia,
  aprobarTransferencia
};