const { Billetera } = require('../models');

const crearBilletera = async (req, res) => {
  try {
    const usuarioId = req.user.id;  
    const { monedaId, saldo } = req.body; 

    if (!monedaId) {
      return res.status(400).json({ error: 'monedaId es obligatorio' });
    }

    const nuevaBilletera = await Billetera.create({
      usuarioId,
      monedaId,
      saldo: saldo || 0
    });

    res.status(201).json(nuevaBilletera);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear billetera' });
  }
};

const obtenerBilleteras = async (_req, res) => {
  try {
    const billeteras = await Billetera.findAll();
    res.json(billeteras);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener billeteras', details: err.message });
  }
};

const obtenerBilleterasDelUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const billetera = await Billetera.findByPk(id);
    if (!billetera) return res.status(404).json({ error: 'Billetera no encontrada' });
    res.json(billetera);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener billetera', details: err.message });
  }
};

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

const obtenerBilleterasDelUsuarioMe = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const billeteras = await Billetera.findAll({  where: { usuarioId:usuarioId  } });

    res.json(billeteras);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener billeteras del usuario', details: err.message });
  }
};

module.exports = {
  crearBilletera,
  obtenerBilleteras,
  actualizarBilletera,
  eliminarBilletera,
  obtenerBilleterasDelUsuarioMe,
  obtenerBilleterasDelUsuario
};
