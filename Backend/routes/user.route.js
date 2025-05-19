const express = require('express');
const router = express.Router();
const requireUser = require('../middlewares/requiredUser');
const requireAdmin = require('../middlewares/requiredAdmin');
const userController = require('../controllers/user.controller');

router.get('/me', requireUser, userController.getUsuarioActual);
router.get('/', requireUser, userController.getUsuarios);
router.get('/:id', requireUser, userController.getUsuarioPorId);
router.put('/admin/:id', requireUser, requireAdmin, userController.hacerAdmin);

module.exports = router;
