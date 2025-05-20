const express = require('express');
const router = express.Router();
const monedaController = require('../controllers/moneda.controller');
const requireUser = require('../middlewares/requiredUser');
const requireAdmin = require('../middlewares/requiredAdmin');

// CRUD completo, protegido para admins
router.post('/', requireUser, requireAdmin, monedaController.crearMoneda);
router.get('/', requireUser,monedaController.obtenerMonedas);
router.get('/:id', requireUser,monedaController.obtenerMonedaPorId);
router.put('/:id', requireUser, requireAdmin, monedaController.actualizarMoneda);
router.delete('/:id', requireUser, requireAdmin, monedaController.eliminarMoneda);

module.exports = router;
