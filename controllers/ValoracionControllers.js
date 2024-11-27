'use strict'

const { dbConfig } = require("../database/db_con")

module.exports = {


    // ---------------------------------------------
    // Crear una valoracion
    // ---------------------------------------------    

    async create(req,res){
        try {
            const valoracion = await dbConfig.Valoracion.create(
                {
                    estrellas: req.body.Estrellas,  
                    publicacion_id: req.body.publicacion_id,
                    usuario_id: req.Usuario.id
                }
            )

            if(valoracion)
                res.redirect(`/Publicacion/showOne/${req.body.publicacion_id}`)
            else
                res.json("No se pudo crear el comentario")
        } catch (error) {
            res.json(error)
        }
    }
}