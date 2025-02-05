const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('horarios', {
    id_horario: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'horarios',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "horarios_pkey",
        unique: true,
        fields: [
          { name: "id_horario" },
        ]
      },
    ]
  });
};
