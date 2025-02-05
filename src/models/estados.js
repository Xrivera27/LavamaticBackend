const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('estados', {
    id_estado: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_estado: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'estados',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "estados_pkey",
        unique: true,
        fields: [
          { name: "id_estado" },
        ]
      },
    ]
  });
};
