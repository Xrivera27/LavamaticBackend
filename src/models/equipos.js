
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipo = sequelize.define('equipos', {
  id_equipo: {
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
  cantidad_total: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  }
}, {
  tableName: 'equipos',
  timestamps: false
});

module.exports = Equipo;