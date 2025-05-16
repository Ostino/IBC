const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Billetera = sequelize.define('Billetera', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
  balance: { 
    type: DataTypes.FLOAT, 
    defaultValue: 0, 
    allowNull: false 
    }
});

module.exports = Billetera;
