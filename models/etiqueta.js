'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Etiqueta extends Model {

    static associate(models) {
      Etiqueta.belongsTo(models.Publicacion, {as: "Publicaciones" ,foreignKey: "publicacion_id"})
    }
  }
  Etiqueta.init({ 
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, 
  {
    sequelize,
    modelName: 'Etiqueta',
  })
  return Etiqueta
}