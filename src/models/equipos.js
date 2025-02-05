const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('equipos', {
    id_equipo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cantidad_total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad_en_uso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    cantidad_mantenimiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'equipos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "equipos_pkey",
        unique: true,
        fields: [
          { name: "id_equipo" },
        ]
      },
    ]
  });
};
