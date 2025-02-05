const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuarios', {
    id_usuario: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "usuarios_email_key"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id_rol'
      }
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'usuarios',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "usuarios_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "usuarios_pkey",
        unique: true,
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });
};
