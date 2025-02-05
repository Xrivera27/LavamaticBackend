const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('repartidores', {
    id_repartidor: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      },
      unique: "repartidores_id_usuario_key"
    },
    codigo_mochila: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    gps_asignado: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "activo"
    }
  }, {
    sequelize,
    tableName: 'repartidores',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "repartidores_id_usuario_key",
        unique: true,
        fields: [
          { name: "id_usuario" },
        ]
      },
      {
        name: "repartidores_pkey",
        unique: true,
        fields: [
          { name: "id_repartidor" },
        ]
      },
    ]
  });
};
