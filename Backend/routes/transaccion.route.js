const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerTransferencia');
const transaccionController  = require('../controllers/transaccion.controller');
const requireUser = require('../middlewares/requiredUser');

router.post('/crear', requireUser, upload.single('comprobante'), transaccionController.crearTransaccion);

router.get('/todas',requireUser, transaccionController.getTodasLasTransacciones);
router.get('/mias', requireUser, transaccionController.getMisTransacciones);

router.patch('/transacciones/:id/aprobar', requireUser, transaccionController.aprobarTransaccion);
router.patch('/transacciones/:id/cancelar', requireUser, transaccionController.cancelarTransaccion);
router.get('/transacciones/:id', requireUser, transaccionController.getTransaccionPorId);

router.get('/usuario/:id', transaccionController.getTransaccionesPorUsuario);

module.exports = router;
