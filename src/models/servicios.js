// src/models/servicio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Equipo = require('./equipos');

const Servicio = sequelize.define('servicios', {
  id_servicio: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  tiempo_estimado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categoria: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  id_equipo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'equipos',
      key: 'id_equipo'
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'servicios',
  timestamps: false
});

// Definir la relación con equipos
Servicio.belongsTo(Equipo, { foreignKey: 'id_equipo', as: 'equipo' });

module.exports = Servicio;