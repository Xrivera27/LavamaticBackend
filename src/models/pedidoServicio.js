// src/models/pedidoServicio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pedido = require('./pedidos');
const Servicio = require('./Servicio');

const PedidoServicio = sequelize.define('pedidos_servicios', {
 id_pedido_servicio: {
   autoIncrement: true,
   type: DataTypes.INTEGER,
   allowNull: false,
   primaryKey: true
 },
 id_pedido: {
   type: DataTypes.INTEGER,
   allowNull: false,
   references: {
     model: 'pedidos',
     key: 'id_pedido'
   }
 },
 id_servicio: {
   type: DataTypes.INTEGER,
   allowNull: false,
   references: {
     model: 'servicios',
     key: 'id_servicio'
   }
 },
 cantidad: {
   type: DataTypes.INTEGER,
   allowNull: false
 },
 subtotal: {
   type: DataTypes.DECIMAL,
   allowNull: false
 }
}, {
 tableName: 'pedidos_servicios',
 timestamps: false
});

PedidoServicio.belongsTo(Pedido, { foreignKey: 'id_pedido' });
PedidoServicio.belongsTo(Servicio, { foreignKey: 'id_servicio', as: 'servicio' });
Pedido.hasMany(PedidoServicio, { foreignKey: 'id_pedido', as: 'servicios' });

module.exports = PedidoServicio;