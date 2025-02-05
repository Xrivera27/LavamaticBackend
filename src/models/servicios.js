const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('servicios', {
    id_servicio: {
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
    precio: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    tiempo_estimado: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoria: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'servicios',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "servicios_pkey",
        unique: true,
        fields: [
          { name: "id_servicio" },
        ]
      },
    ]
  });
};
