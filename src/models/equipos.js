// src/models/equipos.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipo = sequelize.define('equipos', {  // Volver a usar 'equipos' como nombre del modelo
  id_equipo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),  // Mantener la longitud original
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cantidad_total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  cantidad_en_uso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  cantidad_mantenimiento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  activo: {  // Nueva columna de estado
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'equipos',
  timestamps: false  // Mantener los timestamps desactivados
});

module.exports = Equipo;