const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pagos', {
    id_pago: {
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
    monto: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    metodo_pago: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "pendiente"
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'pagos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pagos_pkey",
        unique: true,
        fields: [
          { name: "id_pago" },
        ]
      },
    ]
  });
};
