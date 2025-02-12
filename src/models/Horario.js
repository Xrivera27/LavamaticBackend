
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Horario = sequelize.define('horarios', {
  id_horario: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  tableName: 'horarios',
  timestamps: false
});

module.exports = Horario;