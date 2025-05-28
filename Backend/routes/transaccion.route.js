const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerTransferencia');
const transaccionController  = require('../controllers/transaccion.controller');
const requireUser = require('../middlewares/requiredUser');

router.post('/crear', requireUser, upload.single('comprobante'), transaccionController.crearTransaccion);
router.post('/transferencia', requireUser, transaccionController.crearTransferencia);
router.get('/todas',requireUser, transaccionController.getTodasLasTransacciones);
router.get('/mias', requireUser, transaccionController.getMisTransacciones);

router.post('/crear/transferencia',requireUser,upload.single('comprobantePago'),transaccionController.crearTransferencia);
router.patch('/transacciones/:id/aprobar', requireUser, transaccionController.aprobarTransaccion);
router.patch('/transacciones/:id/cancelar', requireUser, transaccionController.cancelarTransaccion);
router.patch('/transferencia/:id/aprobar', requireUser, transaccionController.aprobarTransferencia);
// Cancelar una transferencia por ID
router.patch('/transferencia/:id/cancelar', requireUser, transaccionController.rechazarTransferencia);
router.get('/transacciones/:id', requireUser, transaccionController.getTransaccionPorId);
// Aprobar una transferencia por ID

router.get('/usuario/:id', transaccionController.getTransaccionesPorUsuario);

module.exports = router;
