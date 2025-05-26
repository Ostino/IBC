const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerTransferencia');
const transaccionController  = require('../controllers/transaccion.controller');
const requireUser = require('../middlewares/requiredUser');

router.post('/crear', requireUser, upload.single('comprobante'), transaccionController.crearTransferencia);

router.get('/todas', transaccionController.getTodasLasTransferencias);
router.get('/mias', requireUser, transaccionController.getMisTransferencias);
router.get('/usuario/:id', transaccionController.getTransferenciasPorUsuario);

module.exports = router;
