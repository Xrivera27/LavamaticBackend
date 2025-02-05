const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('historial_estados', {
    id_historial: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pedidos',
        key: 'id_pedido'
      }
    },
    id_estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'estados',
        key: 'id_estado'
      }
    },
    fecha_cambio: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'historial_estados',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "historial_estados_pkey",
        unique: true,
        fields: [
          { name: "id_historial" },
        ]
      },
    ]
  });
};
