// src/models/mantenimientoEquipo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Equipo = require('./equipos');

const MantenimientoEquipo = sequelize.define('mantenimiento_equipos', {
 id_mantenimiento: {
   autoIncrement: true,
   type: DataTypes.INTEGER,
   allowNull: false,
   primaryKey: true
 },
 id_equipo: {
   type: DataTypes.INTEGER,
   allowNull: false,
   references: {
     model: 'equipos',
     key: 'id_equipo'
   }
 },
 fecha_inicio: {
   type: DataTypes.DATE,
   defaultValue: DataTypes.NOW
 },
 fecha_fin: {
   type: DataTypes.DATE,
   allowNull: true
 },
 descripcion: {
   type: DataTypes.TEXT,
   allowNull: true
 },
 activo: {
   type: DataTypes.BOOLEAN,
   defaultValue: true
 }
}, {
 tableName: 'mantenimiento_equipos',
 timestamps: false
});

MantenimientoEquipo.belongsTo(Equipo, {
 foreignKey: 'id_equipo',
 as: 'equipo'
});

module.exports = MantenimientoEquipo;