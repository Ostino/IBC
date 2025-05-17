const express = require('express');
const router = express.Router();
const requireUser = require('../middlewares/requiredUser');
const userController = require('../controllers/user.controller');

router.get('/me', requireUser, userController.getUsuarioActual);
router.get('/', requireUser, userController.getUsuarios);
router.get('/:id', requireUser, userController.getUsuarioPorId);

module.exports = router;
