const express = require('express');
const router = express.Router();
const anuncioController = require('../controllers/anuncio.controller');
const upload = require('../middlewares/multerAnuncios');
const requireUser = require('../middlewares/requiredUser');
const requireAdmin = require('../middlewares/requiredAdmin');

router.get('/', requireUser,anuncioController.obtenerAnuncios);
router.get('/:id', requireUser,anuncioController.obtenerAnuncioPorId);

router.post('/anuncios', requireUser,upload.single('imagenPago'), anuncioController.crearAnuncio);
router.put('/anuncios/:id',requireUser, upload.single('imagenPago'), anuncioController.actualizarAnuncio);
router.delete('/:id', requireUser, requireAdmin, anuncioController.eliminarAnuncio);

module.exports = router;
