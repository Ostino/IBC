const Anuncio = require('../models/anuncio.model');
const fs = require('fs');
const path = require('path');

// Crear anuncio
const crearAnuncio = async (req, res) => {
  try {
    const { monedaId, tipo, precioPorUnidad, cantidad, descripcionPago, divisa } = req.body;  // agregar divisa
    const usuarioId = req.user.id;

    const anuncio = await Anuncio.create({
      UsuarioId: usuarioId,
      MonedaId: monedaId,
      tipo,
      precioPorUnidad,
      cantidad,
      descripcionPago,
      divisa,   // aquí
      imagenPago: null
    });
    // resto igual
  } catch (error) {
    res.status(500).json({ error: 'Error al crear anuncio', details: error.message });
  }
};


// Obtener todos los anuncios del usuario
const obtenerAnuncios = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const anuncios = await Anuncio.findAll({ where: { UsuarioId: usuarioId } });
    res.json(anuncios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener anuncios', details: error.message });
  }
};

// Obtener anuncio por ID (solo si es del usuario)
const obtenerAnuncioPorId = async (req, res) => {
  try {
    const anuncio = await Anuncio.findOne({
      where: { id: req.params.id, UsuarioId: req.usuarioId }
    });
    if (!anuncio) return res.status(404).json({ error: 'Anuncio no encontrado' });
    res.json(anuncio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener anuncio', details: error.message });
  }
};

// Actualizar anuncio

const actualizarAnuncio = async (req, res) => {
  try {
    const { tipo, precioPorUnidad, cantidad, descripcionPago, disponible } = req.body;
    const anuncio = await Anuncio.findOne({
      where: { id: req.params.id, UsuarioId: req.usuarioId }
    });

    if (!anuncio) return res.status(404).json({ error: 'Anuncio no encontrado' });

    anuncio.tipo = tipo || anuncio.tipo;
    anuncio.precioPorUnidad = precioPorUnidad || anuncio.precioPorUnidad;
    anuncio.cantidad = cantidad || anuncio.cantidad;
    anuncio.descripcionPago = descripcionPago || anuncio.descripcionPago;
    anuncio.disponible = disponible !== undefined ? disponible : anuncio.disponible;

    await anuncio.save();
    res.json(anuncio);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar anuncio', details: error.message });
  }
};

// Eliminar anuncio
const eliminarAnuncio = async (req, res) => {
  try {
    const eliminado = await Anuncio.destroy({
      where: { id: req.params.id, UsuarioId: req.usuarioId }
    });
    if (!eliminado) return res.status(404).json({ error: 'Anuncio no encontrado' });
    res.json({ mensaje: 'Anuncio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar anuncio', details: error.message });
  }
};

/// Controladores extra:

/*const anunciosPorMonedaTipoDisponibleUser = (tipo, disponible) => async (req, res) => {
  try {
    const { monedaId } = req.params;
    const usuarioId = req.user.id;
    const anuncios = await Anuncio.findAll({
      where: {
        MonedaId: monedaId,
        tipo,
        disponible,
        UsuarioId: usuarioId
      }
    });
    res.json(anuncios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener anuncios', details: error.message });
  }
};
*/
const anunciosPorMonedaTipoDisponible = (tipo, disponible) => async (req, res) => {
  try {
    const { monedaId } = req.params;

    const anuncios = await Anuncio.findAll({
      where: {
        MonedaId: monedaId,
        tipo,
        disponible
      }
    });

    res.json(anuncios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener anuncios', details: error.message });
  }
};

const obtenerAnunciosCompraDisponibles = anunciosPorMonedaTipoDisponible('COMPRA', true);
const obtenerAnunciosVentaDisponibles = anunciosPorMonedaTipoDisponible('VENTA', true);
const obtenerAnunciosCompraNoDisponibles = anunciosPorMonedaTipoDisponible('COMPRA', false);
const obtenerAnunciosVentaNoDisponibles = anunciosPorMonedaTipoDisponible('VENTA', false);

module.exports = {
  crearAnuncio,
  obtenerAnuncios,
  obtenerAnuncioPorId,
  actualizarAnuncio,
  eliminarAnuncio,
  obtenerAnunciosCompraDisponibles,
  obtenerAnunciosVentaDisponibles,
  obtenerAnunciosCompraNoDisponibles,
  obtenerAnunciosVentaNoDisponibles
};
