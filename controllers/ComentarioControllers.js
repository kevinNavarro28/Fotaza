'use strict'

const { json } = require("sequelize")
const { dbConfig } = require("../database/db_con")

module.exports = {

    // ---------------------------------------------
    // Crear una comentario
    // ---------------------------------------------

    async create(req,res){
        try {
            const comentario = await dbConfig.Comentario.create(
                {
                    fecha: Date.now(),
                    descripcion: req.body.Descripcion,  
                    publicacion_id: req.body.publicacion_id,
                    usuario_id: req.Usuario.id
                }
            )

            if(comentario)
            res.redirect(`/Publicacion/showOne/${req.body.publicacion_id}`)
            else
                res.json("No se pudo crear el comentario")
        } catch (error)  {
            res.status(500).json({
              message: "Ocurrió un error al logear.",
              error: error.message,
              stack: error.stack
            });
        }
    }
}