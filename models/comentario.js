'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comentario extends Model {

    static associate(models) {
      Comentario.belongsTo(models.Usuario)
      Comentario.belongsTo(models.Publicacion, {foreignKey: "publicacion_id"})
    }
  }
  Comentario.init({
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Comentario',
  })
  return Comentario;
}