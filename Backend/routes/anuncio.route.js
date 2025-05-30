const express = require('express');
const router = express.Router();
const anuncioController = require('../controllers/anuncio.controller');
const upload = require('../middlewares/multerAnuncios');
const requireUser = require('../middlewares/requiredUser');

router.post('/', requireUser, upload.single('imagenPago'), anuncioController.crearAnuncio);
router.get('/', requireUser, anuncioController.obtenerAnuncios);
router.get('/:id', requireUser, anuncioController.obtenerAnuncioPorId);
router.put('/:id', requireUser, upload.single('imagenPago'), anuncioController.actualizarAnuncio);
router.delete('/:id', requireUser, anuncioController.eliminarAnuncio);

router.get('/moneda/:monedaId/compra/disponibles', requireUser, anuncioController.obtenerAnunciosCompraDisponibles);
router.get('/moneda/:monedaId/venta/disponibles', requireUser, anuncioController.obtenerAnunciosVentaDisponibles);
router.get('/moneda/:monedaId/compra/no-disponibles', requireUser, anuncioController.obtenerAnunciosCompraNoDisponibles);
router.get('/moneda/:monedaId/venta/no-disponibles', requireUser, anuncioController.obtenerAnunciosVentaNoDisponibles);

module.exports = router;
