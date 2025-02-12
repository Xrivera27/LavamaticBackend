// src/models/pedido.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Estado = require('./estados');
const Usuario = require('./User');


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
  }
}, {
  tableName: 'pedidos',
  timestamps: false
});

// Ponemos todas las asociaciones aquí
Pedido.belongsTo(Estado, { foreignKey: 'id_estado', as: 'estado' });
Pedido.belongsTo(Usuario, { foreignKey: 'id_cliente', as: 'cliente' });
Pedido.belongsTo(Usuario, { foreignKey: 'id_repartidor', as: 'repartidor' });
module.exports = Pedido;