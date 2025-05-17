const Usuario = require('../models/usuario.model');

// GET /api/usuarios/me
const getUsuarioActual = async (req, res) => {
  try {
    const usuario = req.user;
    res.json({
      id: usuario.id,
      username: usuario.username,
      email: usuario.email
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario actual' });
  }
};

// GET /api/usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'username', 'email']
    });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// GET /api/usuarios/:id
const getUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id, {
      attributes: ['id', 'username', 'email']
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

module.exports = {
  getUsuarioActual,
  getUsuarios,
  getUsuarioPorId
};
