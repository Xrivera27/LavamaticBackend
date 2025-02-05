const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roles_permisos', {
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'roles',
        key: 'id_rol'
      }
    },
    permisos: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'roles_permisos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "roles_permisos_pkey",
        unique: true,
        fields: [
          { name: "id_rol" },
        ]
      },
    ]
  });
};
