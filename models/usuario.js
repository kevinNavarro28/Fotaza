'use strict'

const { Model } = require('sequelize')
  
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    
    static associate(models) {
        Usuario.hasMany(models.Imagen ,{as: "Imagenes", foreignKey: "usuario_id"})
        Usuario.hasMany(models.Comentario ,{as: "Comentarios", foreignKey: "usuario_id"})
        Usuario.hasOne(models.Valoracion, {as:"valoraciones",foreignKey: "usuario_id"})
        Usuario.hasMany(models.Publicacion, {as: "Publicaciones",foreignKey: "usuario_id"})
        Usuario.hasOne(models.Watermark, {as:"watermark",foreignKey: "usuario_id"})
    }
  }
  Usuario.init({
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    clave: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    fecha_nac: {
      type: DataTypes.DATE,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    interes: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    nickname :{
      type : DataTypes.STRING(100),
      allowNull:true
    }
  }, {
    sequelize,
    modelName: 'Usuario',
  })
  return Usuario
}