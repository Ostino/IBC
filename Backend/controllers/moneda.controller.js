const { Moneda } = require('../models');

// Crear moneda
const crearMoneda = async (req, res) => {
  try {
    const { codigo, nombre, valueInSus } = req.body;

    const existe = await Moneda.findOne({ where: { codigo } });
    if (existe) {
      return res.status(400).json({ error: 'El código de moneda ya existe' });
    }

    const moneda = await Moneda.create({ codigo, nombre, valueInSus });
    res.status(201).json(moneda);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear moneda', details: err.message });
  }
};

// Obtener todas las monedas
const obtenerMonedas = async (req, res) => {
  try {
    const monedas = await Moneda.findAll();
    res.json(monedas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener monedas', details: err.message });
  }
};

// Obtener moneda por ID
const obtenerMonedaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const moneda = await Moneda.findByPk(id);

    if (!moneda) {
      return res.status(404).json({ error: 'Moneda no encontrada' });
    }

    res.json(moneda);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar moneda', details: err.message });
  }
};

// Actualizar moneda
const actualizarMoneda = async (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, valueInSus } = req.body;

  try {
    const moneda = await Moneda.findByPk(id);
    if (!moneda) {
      return res.status(404).json({ error: 'Moneda no encontrada' });
    }

    // Validar que el nuevo código no esté en uso por otra moneda
    if (codigo && codigo !== moneda.codigo) {
      const codigoExistente = await Moneda.findOne({
        where: { codigo }
      });
      if (codigoExistente) {
        return res.status(400).json({ error: 'El código ya está en uso por otra moneda' });
      }
    }

    await moneda.update({
      codigo: codigo ?? moneda.codigo,
      nombre: nombre ?? moneda.nombre,
      valueInSus: valueInSus ?? moneda.valueInSus
    });

    res.json(moneda);
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar la moneda',
      details: error.message
    });
  }
};

// Eliminar moneda
const eliminarMoneda = async (req, res) => {
  try {
    const { id } = req.params;
    const moneda = await Moneda.findByPk(id);

    if (!moneda) {
      return res.status(404).json({ error: 'Moneda no encontrada' });
    }

    await moneda.destroy();
    res.json({ mensaje: 'Moneda eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar moneda', details: err.message });
  }
};

module.exports = {
  crearMoneda,
  obtenerMonedas,
  obtenerMonedaPorId,
  actualizarMoneda,
  eliminarMoneda,
};
