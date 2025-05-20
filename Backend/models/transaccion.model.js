const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaccion = sequelize.define('Transaccion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: { 
    type: DataTypes.ENUM('COMPRA', 'VENTA', 'TRANSFERENCIA'),
    allowNull: false
    },
  monto: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
    },
  descripcionPago: { type: DataTypes.STRING },
  comprobantePago: { type: DataTypes.STRING }, // Imagen o texto del comprobante
});
module.exports = Transaccion;
