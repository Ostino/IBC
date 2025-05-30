const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadFolder = 'ImagenesAnuncios/';

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, Date.now() + '_' + baseName + ext);
  }
});

const upload = multer({ storage });

module.exports = upload;
