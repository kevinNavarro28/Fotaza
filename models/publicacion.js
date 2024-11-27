'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Publicacion extends Model {

    static associate(models) {
      Publicacion.belongsTo(models.Imagen, {as:"Imagenes" , foreignKey: "imagen_id", onDelete: "CASCADE"})
      Publicacion.belongsTo(models.Usuario, {as:"Usuario", foreignKey: "usuario_id"})
      Publicacion.hasMany(models.Valoracion, {as: "Valoraciones", foreignKey: "publicacion_id" , onDelete: "CASCADE"})
      Publicacion.hasMany(models.Comentario, {as: "Comentario", foreignKey: "publicacion_id" , onDelete: "CASCADE"})
      Publicacion.hasOne(models.Etiqueta, {as: "Etiquetas", foreignKey: "publicacion_id" , onDelete: "CASCADE"})

    }
  }
  Publicacion.init({
    titulo: {
      type: DataTypes.STRING(100),
      
    },
    categoria: {
      type: DataTypes.ENUM("Ninguno","Colegio","Juguetes","Animales","Alimentos","Ropa","Transporte","Oficios","Partes del Cuerpo","Muebles","Instrumentos Musicales","Flores"), 
      defaultValue: "Ninguno"
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      
    },
    etiqueta_id: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      references: {
          model: 'Etiqueta', 
          key: 'id'
      }},
      estado : {
        type : DataTypes.STRING(50)
      }
   
  }, {
    sequelize,
    modelName: 'Publicacion',
  })
  return Publicacion;
}