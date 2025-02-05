const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pedidos', {
    id_pedido: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    id_repartidor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'repartidores',
        key: 'id_repartidor'
      }
    },
    direccion_recogida: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    direccion_entrega: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'estados',
        key: 'id_estado'
      }
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'pedidos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pedidos_pkey",
        unique: true,
        fields: [
          { name: "id_pedido" },
        ]
      },
    ]
  });
};
