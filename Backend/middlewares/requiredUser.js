const { Usuario, Token } = require('../models');


const requireUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const tokenStr = authHeader.split(' ')[1];

    const token = await Token.findOne({
      where: { token: tokenStr },
      include: {
      model: Usuario,
      attributes: ['id','rol', 'username', 'email']
      }
    });

    if (!token || !token.Usuario) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    req.user = token.Usuario; 
    next();
  } catch (err) {
    res.status(500).json({ error: 'Error al verificar token', details: err.message });
  }
};

module.exports = requireUser;
