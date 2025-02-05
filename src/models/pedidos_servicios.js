const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pedidos_servicios', {
    id_pedido_servicio: {
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
    id_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'servicios',
        key: 'id_servicio'
      }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'pedidos_servicios',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pedidos_servicios_pkey",
        unique: true,
        fields: [
          { name: "id_pedido_servicio" },
        ]
      },
    ]
  });
};
