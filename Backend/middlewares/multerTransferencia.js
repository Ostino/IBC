const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Carpeta destino
const uploadFolder = 'ImagenesComprobante/';

// Asegurarse que la carpeta exista
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Configuración multer con nombre temporal
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    // Nombre temporal: timestamp + original name
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, Date.now() + '_' + baseName + ext);
  }
});

const upload = multer({ storage });

module.exports = upload;
