// src/models/repartidores.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./User');

const Repartidor = sequelize.define('repartidores', {
 id_repartidor: {
   autoIncrement: true,
   type: DataTypes.INTEGER,
   allowNull: false,
   primaryKey: true
 },
 id_usuario: {
   type: DataTypes.INTEGER,
   allowNull: false,
   references: {
     model: 'usuarios',
     key: 'id_usuario'
   }
 },
 codigo_mochila: {
   type: DataTypes.STRING(50),
   allowNull: true
 },
 gps_asignado: {
   type: DataTypes.STRING(50),
   allowNull: true
 },
 estado: {
   type: DataTypes.STRING(20),
   defaultValue: "activo"
 }
}, {
 tableName: 'repartidores',
 timestamps: false
});

Repartidor.belongsTo(Usuario, { 
 foreignKey: 'id_usuario',
 as: 'user' 
});

module.exports = Repartidor;