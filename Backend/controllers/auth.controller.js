const { Usuario, Token } = require('../models');
const { hashPassword, verifyPassword, generateToken } = require('../utils/crypto');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashed = hashPassword(password, username);
    const nuevoUsuario = await Usuario.create({ username, email, password: hashed });

    const tokenStr = generateToken(username, email);
    await Token.create({ token: tokenStr, usuarioId: nuevoUsuario.id });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token: tokenStr,
      user: {
        id: nuevoUsuario.id,
        username: nuevoUsuario.username,
        email: nuevoUsuario.email
      }
    });
  } catch (err) {
    res.status(400).json({ error: 'Error al registrar usuario', details: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const esValido = verifyPassword(password, usuario.password);
    if (!esValido) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const tokenStr = generateToken(usuario.username, usuario.email);
    await Token.create({ token: tokenStr, usuarioId: usuario.id });

    res.json({
      message: 'Login exitoso',
      token: tokenStr,
      user: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error interno', details: err.message });
  }
};

// ✅ Cerrar sesión actual
const logout = async (req, res) => {
  try {
    const tokenString = req.headers.authorization.split(' ')[1];

    await Token.destroy({
      where: { token: tokenString }
    });

    res.json({ message: 'Sesión cerrada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al cerrar sesión', details: err.message });
  }
};

// ✅ Cerrar todas las sesiones del usuario
const logoutAll = async (req, res) => {
  try {
    const usuario = req.user;

    await Token.destroy({
      where: { usuarioId: usuario.id }
    });

    res.json({ message: 'Todas las sesiones han sido cerradas' });
  } catch (err) {
    res.status(500).json({ error: 'Error al cerrar todas las sesiones', details: err.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  logoutAll
};
