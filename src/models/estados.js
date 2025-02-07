// src/models/estado.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Estado = sequelize.define('estados', {
  id_estado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_estado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'estados',
  timestamps: false
});

module.exports = Estado;