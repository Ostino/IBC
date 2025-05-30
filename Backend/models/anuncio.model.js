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
  disponible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
    },
  descripcionPago: { 
    type: DataTypes.TEXT 
    },
  imagenPago: { 
    type: DataTypes.TEXT 
    },
  divisa: { 
    type: DataTypes.STRING, 
    allowNull: false 
    }
});

module.exports = Anuncio;
