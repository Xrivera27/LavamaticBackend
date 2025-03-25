// src/models/pedidos_equipos.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "pedidos_equipos_pkey",
      unique: true,
      fields: [
        { name: "id_pedido_equipo" },
      ]
    },
  ]
});

module.exports = PedidoEquipo;