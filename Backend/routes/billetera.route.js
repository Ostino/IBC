const express = require('express');
const router = express.Router();
const billeteraController = require('../controllers/billetera.controller');
const requireUser = require('../middlewares/requiredUser');

router.get('/', requireUser, billeteraController.obtenerBilleteras);
router.get('/mes', requireUser, billeteraController.obtenerBilleterasDelUsuarioMe);
router.get('/:id', requireUser, billeteraController.obtenerBilleterasDelUsuario);

router.post('/', requireUser, billeteraController.crearBilletera);
router.delete('/:id', requireUser, billeteraController.eliminarBilletera);

module.exports = router;