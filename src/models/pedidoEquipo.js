// src/models/pedidoEquipo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pedido = require('./pedidos');
const Equipo = require('./equipos');

const PedidoEquipo = sequelize.define('pedidos_equipos', {
  id_pedido_equipo: {
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
  id_equipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'equipos',
      key: 'id_equipo'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'pedidos_equipos',
  timestamps: false
});

// Asociaciones
PedidoEquipo.belongsTo(Pedido, { foreignKey: 'id_pedido', as: 'pedido' });
PedidoEquipo.belongsTo(Equipo, { foreignKey: 'id_equipo', as: 'equipo' });

module.exports = PedidoEquipo;