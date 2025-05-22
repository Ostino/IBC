const { Billetera } = require('../models');

// 1. Crear billetera
const crearBilletera = async (req, res) => {
  try {
    const usuarioId = req.user.id;  // Extrae correctamente el id del usuario del token
    const { monedaId, saldo } = req.body;  // Usa monedaId en minúscula para coincidir con el modelo

    if (!monedaId) {
      return res.status(400).json({ error: 'monedaId es obligatorio' });
    }

    const nuevaBilletera = await Billetera.create({
      usuarioId,   // clave foránea en minúscula
      monedaId,    // clave foránea en minúscula
      saldo: saldo || 0
    });

    res.status(201).json(nuevaBilletera);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear billetera' });
  }
};

// 2. Listar todas las billeteras
const obtenerBilleteras = async (_req, res) => {
  try {
    const billeteras = await Billetera.findAll();
    res.json(billeteras);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener billeteras', details: err.message });
  }
};

// 3. Obtener una billetera por ID
const obtenerBilleteraPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const billetera = await Billetera.findByPk(id);
    if (!billetera) return res.status(404).json({ error: 'Billetera no encontrada' });
    res.json(billetera);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener billetera', details: err.message });
  }
};

// 4. Actualizar billetera
const actualizarBilletera = async (req, res) => {
  try {
    const { id } = req.params;
    const { saldo } = req.body;

    const billetera = await Billetera.findByPk(id);
    if (!billetera) return res.status(404).json({ error: 'Billetera no encontrada' });

    await billetera.update({ saldo });
    res.json(billetera);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar billetera', details: err.message });
  }
};

// 5. Eliminar billetera
const eliminarBilletera = async (req, res) => {
  try {
    const { id } = req.params;
    const billetera = await Billetera.findByPk(id);
    if (!billetera) return res.status(404).json({ error: 'Billetera no encontrada' });

    await billetera.destroy();
    res.json({ mensaje: 'Billetera eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar billetera', details: err.message });
  }
};

const obtenerBilleterasPorUsuarioId = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const billeteras = await Billetera.findAll({ where: { usuarioId } });

    res.json(billeteras);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener billeteras del usuario', details: err.message });
  }
};
module.exports = {
  crearBilletera,
  obtenerBilleteras,
  obtenerBilleteraPorId,
  actualizarBilletera,
  eliminarBilletera,
  obtenerBilleterasPorUsuarioId
};
