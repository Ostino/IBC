const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Billetera = sequelize.define('Billetera', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  saldo: { 
    type: DataTypes.FLOAT, 
    defaultValue: 0, 
    allowNull: false 
    },
    monedaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Billetera;
