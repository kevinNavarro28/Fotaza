'use strict'

const { addWatermark } = require("jimp-watermark")
const { dbConfig } = require("../database/db_con"),
                fs = require("fs"),
    {  minetypes } = require("../helppers/multerConfig")

module.exports = {

    // ---------------------------------------------
    // Actualizar datos de perfil
    // ---------------------------------------------

    async update(req, res) {
        try {
            // Encontrar el avatar actual del usuario
            const avatarUsuario = await dbConfig.Usuario.findOne({
                attributes: ["avatar"],
                where: {
                    id: req.Usuario.id
                }
            });
    
            // Construir el objeto de actualización
            let updateData = {
                nombre: req.body.Nombre,
                apellido: req.body.Apellido,
                email: req.body.Email,
                clave: req.body.Clave,
                interes: req.body.Interes,
                telefono: req.body.Telefono,
                fecha_nac: req.body.Fecha_Nac,
                nickname: req.body.Nickname
            };
    
            // Solo agregar el avatar si hay un nuevo archivo cargado
            if (req.file && req.file.filename) {
                // Eliminar el avatar actual si no es "null"
                if (avatarUsuario && avatarUsuario.avatar && avatarUsuario.avatar !== "null") {
                    const avatarPath = path.join(__dirname, `../storage/avatar/${avatarUsuario.avatar}`);
    
                    // Verificar si el archivo existe antes de eliminarlo
                    if (fs.existsSync(avatarPath)) {
                        fs.unlinkSync(avatarPath);
                    }
                }
                updateData.avatar = req.file.filename;
            }
    
            // Actualizar el usuario
            const Usuario = await dbConfig.Usuario.update(updateData, {
                where: {
                    id: req.Usuario.id
                }
            });
    
            if (Usuario) {
                res.redirect("/Usuario");
            } else {
                res.json({ error: "No se encontro ningun dato" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al actualizar el usuario" });
        }
    },

    // ---------------------------------------------
    // Crear una marca de agua Texto/Imagen
    // ---------------------------------------------

    async addWatermark(req,res){
        try {
            const watermark = await dbConfig.Watermark.create(
                {
                    tipo: req.body.Tipo,
                    marca: req.file ? req.file.filename : req.body.watermark,
                    usuario_id: req.Usuario.id
                }
            )
            if(watermark)
            {
                res.redirect("/Usuario")
            }
        } 
        catch (error) {
            res.json(error)
        }

    },

    // ---------------------------------------------
    // Eliminar Marca de agua
    // ---------------------------------------------

    async deleteWatermark(req,res){
        try {

            if(req.Usuario.watermark.tipo == "Imagen")
            {
                fs.unlinkSync(path.join(__dirname,`../storage/watermark/${req.Usuario.watermark.marca}`))
            }

            const deleteWatermark = await dbConfig.Watermark.destroy(
                {
                    where: {
                        usuario_id: req.Usuario.id
                    }
                }
            )
            if(deleteWatermark)
            {
                res.redirect("/Usuario")
            }
        } 
        catch (error) {
            res.json(error)
        }

    },
}