'use strict'

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Imagen extends Model {
    static associate(models) {
      Imagen.belongsTo(models.Usuario)
      Imagen.hasOne(models.Publicacion ,{as: "Post",foreignKey: "imagen_id" , onDelete: "CASCADE"})
    }
  }
  Imagen.init({
    nombre: {
      type: DataTypes.STRING(100),
      
    },
    estado: {
      type: DataTypes.ENUM("Publico","Protegido"),
      defaultValue: "Protegido"
    },
    
    formato: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    resolucion: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    derechos_autor: {
      type: DataTypes.ENUM("Copyright","Copyleft"),
      defaultValue: "Copyright"
    },
  }, {
    sequelize,
    modelName: 'Imagen',
  })
  return Imagen;
}