const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mantenimiento_equipos', {
    id_mantenimiento: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_equipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'equipos',
        key: 'id_equipo'
      }
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mantenimiento_equipos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "mantenimiento_equipos_pkey",
        unique: true,
        fields: [
          { name: "id_mantenimiento" },
        ]
      },
    ]
  });
};
