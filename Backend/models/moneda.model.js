const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Moneda = sequelize.define('Moneda', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  valueInSus: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

module.exports = Moneda;
