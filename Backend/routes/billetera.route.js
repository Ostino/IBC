const express = require('express');
const router = express.Router();
const billeteraController = require('../controllers/billetera.controller');
const requireUser = require('../middlewares/requiredUser');

router.get('/', requireUser, billeteraController.obtenerBilleteras);
router.get('/:id', requireUser, billeteraController.obtenerBilleteraPorId);
router.get('/usuario/:usuarioId', requireUser, billeteraController.obtenerBilleterasPorUsuarioId);

router.post('/', requireUser, billeteraController.crearBilletera);
router.put('/:id', requireUser, billeteraController.actualizarBilletera);
router.delete('/:id', requireUser, billeteraController.eliminarBilletera);

module.exports = router;