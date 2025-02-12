// src/models/reservaEquipo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pedido = require('./pedidos');
const Equipo = require('./equipos');
const Horario = require('./horario');

const ReservaEquipo = sequelize.define('reservas_equipos', {
  id_reserva: {
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
  id_equipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'equipos',
      key: 'id_equipo'
    }
  },
  id_horario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'horarios',
      key: 'id_horario'
    }
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'reservas_equipos',
  timestamps: false
});

// Asociaciones
ReservaEquipo.belongsTo(Pedido, { foreignKey: 'id_pedido', as: 'pedido' });
ReservaEquipo.belongsTo(Equipo, { foreignKey: 'id_equipo', as: 'equipo' });
ReservaEquipo.belongsTo(Horario, { foreignKey: 'id_horario', as: 'horario' });

module.exports = ReservaEquipo;