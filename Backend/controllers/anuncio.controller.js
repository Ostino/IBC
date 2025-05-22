const { Anuncio } = require('../models');
const path = require('path');
const fs = require('fs');
// Crear anuncio
const crearAnuncio = async (req, res) => {
  try {
    const { usuarioId, monedaId, tipo, precioPorUnidad, cantidad, descripcionPago } = req.body;

    // Primero crear anuncio SIN imagen
    const anuncio = await Anuncio.create({
      usuarioId,
      monedaId,
      tipo,
      precioPorUnidad,
      cantidad,
      descripcionPago,
      imagenPago: null
    });

    // Si hay imagen subida, renombrarla
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const nuevoNombre = `${anuncio.id}_${path.basename(req.file.originalname, ext)}${ext}`;
      const nuevoPath = path.join(req.file.destination, nuevoNombre);

      // Renombrar archivo
      fs.renameSync(req.file.path, nuevoPath);

      // Actualizar anuncio con el nuevo nombre
      anuncio.imagenPago = nuevoPath; // ruta relativa completa
      await anuncio.save();
    }

    res.status(201).json(anuncio);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear anuncio', details: error.message });
  }
};

// Obtener todos los anuncios
const obtenerAnuncios = async (req, res) => {
  try {
    const anuncios = await Anuncio.findAll();
    res.json(anuncios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener anuncios' });
  }
};

// Obtener un anuncio por ID
const obtenerAnuncioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const anuncio = await Anuncio.findByPk(id);
    if (!anuncio) return res.status(404).json({ error: 'Anuncio no encontrado' });
    res.json(anuncio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener anuncio' });
  }
};

// Actualizar anuncio
const actualizarAnuncio = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const anuncio = await Anuncio.findByPk(id);
    if (!anuncio) return res.status(404).json({ error: 'Anuncio no encontrado' });

    // Si hay nueva imagen, renombrar igual
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const nuevoNombre = `${anuncio.id}_${path.basename(req.file.originalname, ext)}${ext}`;
      const nuevoPath = path.join(req.file.destination, nuevoNombre);

      fs.renameSync(req.file.path, nuevoPath);

      datos.imagenPago = nuevoPath;
    }

    await anuncio.update(datos);
    res.json(anuncio);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar anuncio' });
  }
};

// Eliminar anuncio
const eliminarAnuncio = async (req, res) => {
  try {
    const { id } = req.params;
    const anuncio = await Anuncio.findByPk(id);
    if (!anuncio) return res.status(404).json({ error: 'Anuncio no encontrado' });

    await anuncio.destroy();
    res.json({ mensaje: 'Anuncio eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar anuncio' });
  }
};

module.exports = {
  crearAnuncio,
  obtenerAnuncios,
  obtenerAnuncioPorId,
  actualizarAnuncio,
  eliminarAnuncio,
};
