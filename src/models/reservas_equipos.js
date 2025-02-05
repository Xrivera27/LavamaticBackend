const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reservas_equipos', {
    id_reserva: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pedidos',
        key: 'id_pedido'
      }
    },
    id_equipo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'equipos',
        key: 'id_equipo'
      },
      unique: "reservas_equipos_id_equipo_id_horario_fecha_key"
    },
    id_horario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'horarios',
        key: 'id_horario'
      },
      unique: "reservas_equipos_id_equipo_id_horario_fecha_key"
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: "reservas_equipos_id_equipo_id_horario_fecha_key"
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'reservas_equipos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "reservas_equipos_id_equipo_id_horario_fecha_key",
        unique: true,
        fields: [
          { name: "id_equipo" },
          { name: "id_horario" },
          { name: "fecha" },
        ]
      },
      {
        name: "reservas_equipos_pkey",
        unique: true,
        fields: [
          { name: "id_reserva" },
        ]
      },
    ]
  });
};
