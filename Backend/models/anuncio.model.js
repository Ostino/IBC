const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Anuncio = sequelize.define('Anuncio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: { 
    type: DataTypes.ENUM('COMPRA', 'VENTA'),
    allowNull: false
  },
  precioPorUnidad: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
    },
  cantidad: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
    },
  descripcionPago: { 
    type: DataTypes.TEXT 
    },  // Texto explicando método de pago
  imagenPago: { 
    type: DataTypes.TEXT 
    },       // Imagen o URL (base64 o string)
  divisa: { 
    type: DataTypes.STRING, 
    allowNull: false 
    } // moneda en texto para fácil acceso
});

module.exports = Anuncio;
