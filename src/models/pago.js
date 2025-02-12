// src/models/pago.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pedido = require('./pedidos');

const Pago = sequelize.define('pagos', {
  id_pago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pedidos',
      key: 'id_pedido'
    }
  },
  monto: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  metodo_pago: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'efectivo'
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pagado'
  },
  fecha_pago: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'pagos',
  timestamps: false
});

Pago.belongsTo(Pedido, { foreignKey: 'id_pedido', as: 'pedido' });

module.exports = Pago;