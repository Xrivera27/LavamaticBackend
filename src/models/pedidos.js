// src/models/pedido.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Estado = require('./estados');
const Usuario = require('./User');
const PedidoServicio = require('./pedidoServicio');
const PedidoEquipo = require('./pedidoEquipo');
const ReservaEquipo = require('./reservaEquipo');

const Pedido = sequelize.define('pedidos', {
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  },
  id_repartidor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  },
  direccion_recogida: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  direccion_entrega: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  id_estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    references: {
      model: 'estados',
      key: 'id_estado'
    }
  },
  total: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'pedidos',
  timestamps: false
});

// Asociaciones existentes
Pedido.belongsTo(Estado, { foreignKey: 'id_estado', as: 'estado' });
Pedido.belongsTo(Usuario, { foreignKey: 'id_cliente', as: 'cliente' });
Pedido.belongsTo(Usuario, { foreignKey: 'id_repartidor', as: 'repartidor' });

// Nuevas asociaciones
Pedido.hasMany(PedidoServicio, { foreignKey: 'id_pedido', as: 'servicios' });
Pedido.hasMany(PedidoEquipo, { foreignKey: 'id_pedido', as: 'equipos' });
Pedido.hasMany(ReservaEquipo, { foreignKey: 'id_pedido', as: 'reservas' });

module.exports = Pedido;