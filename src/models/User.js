// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('usuarios', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING
  },
  direccion: {
    type: DataTypes.TEXT
  },
  id_rol: {
    type: DataTypes.INTEGER,
    defaultValue: 2 // Por defecto es cliente
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

module.exports = User;