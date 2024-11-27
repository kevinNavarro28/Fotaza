'use strict'

const { response } = require("express")
const { dbConfig } = require("../database/db_con"),
                fs = require("fs"),
            { Op } = require("sequelize"),
     { Sequelize } = require("sequelize"),
     { minetypes } = require("../helppers/multerConfig"),
         watermark = require("jimp-watermark")
         const Jimp = require('jimp');
         const sharp = require('sharp');
        

module.exports = {

    // ---------------------------------------------
    // Mostrar mis publicaciones
    // ---------------------------------------------

    async show(req,res){
        try {

            const publicacion = await dbConfig.Publicacion.findAll(
                {
                    include: ["Imagenes","Valoraciones","Usuario","Comentario","Etiquetas"],
                    where: {
                        usuario_id: req.Usuario.id
                    }
                }
            )
            
            if( publicacion )
                res.render("Usuario/Usuario",{Publicacion: publicacion ,Usuario: req.Usuario})
            else
                res.json("No se encontraron publicaciones")

        } catch (error) {
            res.json(error)
        }
    },


    async showPublicacion(req,res){
        try {

            const publicacion = await dbConfig.Publicacion.findAll(
                {
                    include: ["Imagenes","Valoraciones","Usuario","Comentario","Etiquetas"],
                    where: {
                        usuario_id: req.Usuario.id
                    }
                }
            )
            
            
            if( publicacion )
                res.render("Publicacion/MisPublicaciones",{Publicacion: publicacion ,Usuario: req.Usuario,})
            else
                res.json("No se encontraron publicaciones")

        } catch (error) {
            res.status(500).json({
              message: "Ocurrió un error al mostrar.",
              error: error.message,
              stack: error.stack
            });
        }
    },

    // ---------------------------------------------
    // Mostrar una publicacion
    // ---------------------------------------------

    async showOne(req,res){
        try {

            const publicacion = await dbConfig.Publicacion.findOne(
                {
                    include: ["Imagenes","Valoraciones","Usuario","Comentario","Etiquetas"],
                    where: {
                        id: req.params.id
                    }
                }
            )

            const valorado = await dbConfig.Valoracion.findOne(
                {
                    where: {
                        usuario_id: req.Usuario.id,
                        publicacion_id: publicacion.id
                    }
                }
            )
            
            const sum = await dbConfig.Valoracion.sum("Estrellas",{
                where: {
                    publicacion_id: publicacion.id
                }
            })
            const count = await dbConfig.Valoracion.count({
                where: {
                    publicacion_id: publicacion.id
                }
            })

            const comentarios = await dbConfig.Comentario.findAll({
                include: ["Usuario"],
                where: {
                    publicacion_id: publicacion.id
                }
            })


            if( publicacion )
                res.render("Publicacion/View",{Publicacion: publicacion ,Usuario: req.Usuario, Sum: sum, Count: count, Valorado: valorado, Comentarios: comentarios,MyTitle: "Publicacion"})
                // res.json(comentarios)
            else
                res.json("No se encontraron publicaciones")

        } catch (error)  {
            res.status(500).json({
              message: "Ocurrió un error al logear.",
              error: error.message,
              stack: error.stack
            });
        }
    },

    // ---------------------------------------------
    // Mostrar todas las publicaciones en Home
    // ---------------------------------------------

    async showAll(req,res){
        try {
                //Publicaciones Home

                const fecha = new Date();
                fecha.setMonth(fecha.getMonth() - 12)

                const publicacion = await dbConfig.Publicacion.findAll(
                    {
                        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('usuario_id')), 'usuario_id']],
                        limit: 35,
                        order: Sequelize.literal('rand()'),
                        where: {
                            fecha_creacion: {
                                [Op.gt]: fecha
                            }
                        }
                    }
                ),

                lista = []

                for (let i = 0; i < publicacion.length; i++)
                {
                    const post = await dbConfig.Publicacion.findOne({
                        include: ['Imagenes'],
                        where: {
                            usuario_id: publicacion[i].usuario_id
                        }
                    })
                    lista.push(post) 
                }

                //Destacados

                const fechaDestacados = new Date()
                fechaDestacados.setDate(fechaDestacados.getDate() - 7)

                const listaDestacados = await dbConfig.Publicacion.findAll(
                    {
                        attributes: ["id"],
                        limit: 5, 
                        where: {
                            fecha_creacion: {
                                [Op.gt]: fechaDestacados
                            }
                        }
                    }
                ),

                filtro1 = [],
                filtro2 = [],
                destacados = []

                for (let a = 0; a < listaDestacados.length; a++)
                {
                    const post = await dbConfig.Publicacion.findOne({
                        include: ["Imagenes","Valoraciones","Usuario","Comentario","Etiquetas"],
                        where: {
                            id: listaDestacados[a].id
                        }
                    })
                    filtro1.push(post) 
                }

                

                for(let b = 0; b < filtro1.length; b++)
                {
                    const count = await dbConfig.Valoracion.findAndCountAll({
                        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('publicacion_id')), 'publicacion_id']]
                        ,where: {publicacion_id: filtro1[b].id}
                        
                    })
                    if(count.count >= 1) //Regular la cantidad de valoraciones
                    {
                        filtro2.push(count.rows[0].publicacion_id)
                    }
                    
                }

                for (let c = 0; c < filtro2.length; c++)
                {
                    const sum = await dbConfig.Valoracion.sum("Estrellas",{
                        where: {
                            publicacion_id: filtro2[c]
                        }
                    })

                    const count = await dbConfig.Valoracion.count({
                        where: {
                            publicacion_id: filtro2[c]
                        }
                    })

                    if((sum/count) >= 4)// regular promedio
                    {
                        const post = await dbConfig.Publicacion.findOne({
                            include: ["Imagenes","Valoraciones","Usuario","Comentario","Etiquetas"],
                            where: {
                                id: filtro2[c]
                            }
                        })
                        destacados.push(post) 
                    }


                }
                const usuarioValoraciones = await dbConfig.Valoracion.findAll({
                    where: {
                        usuario_id: req.Usuario.id
                    }
                });

                const valoracionesMap = usuarioValoraciones.reduce((map, valoracion) => {
                    map[valoracion.publicacion_id] = valoracion;
                    return map; 
                }, {});
        
                lista.forEach(publicacion => {
                    publicacion.Valorado = valoracionesMap[publicacion.id] ? true : false;
                });
                


                
                if( publicacion )
                    if(destacados)
                        res.render("Home/Index",{Publicacion: lista ,Usuario: req.Usuario ,Destacados: destacados,MyTitle: "Home"})
                    else
                        res.render("Home/Index",{Publicacion: lista ,Usuario: req.Usuario})
                else
                    res.json("No se encontraron publicaciones")

        } catch (error)  {
            res.status(500).json({
              message: "Ocurrió un error al logear.",
              error: error.message,
              stack: error.stack
            });
        }
    },

    // ---------------------------------------------
    // Mostrar Todas las Publicaciones Publicas
    // ---------------------------------------------

    async showAllPublic(req,res){
        try {

            const publicacion = await dbConfig.Publicacion.findAll(
                {
                    include: [{
                        association: "Imagenes",
                        where: {
                            Estado: "Publico"
                        }
                    }]
                }
            )
            
            if( publicacion )
                res.render("Public/Public",{Publicacion: publicacion,MyTitle: "Publicaciones Publicas"})
            else
                res.json("No se encontraron publicaciones")

        } catch (error)  {
            res.status(500).json({
              message: "Ocurrió un error al logear.",
              error: error.message,
              stack: error.stack
            });
        }
    },

    // ---------------------------------------------
    // Crear una Publicacion
    // ---------------------------------------------
    
    async post(req,res){ 
        try {
            if(req.body.Estado == "Publico"){
                const options = {
                    'ratio': 0.6,
                    'opacity': 0.6,
                    'dstPath': `./storage/public_watermark/${req.file.filename}`
                }
    
                watermark.addWatermark(path.join(__dirname, `../storage/public/${req.file.filename}`), 
                                        path.join(__dirname, `../publics/img/logo_transparent.png`), 
                                        options)
            }

            if(req.body.Estado == "Protegido" && req.Usuario.watermark){
                if(req.Usuario.watermark.tipo == "Imagen"){
                    const options = {
                        'ratio': 0.5,
                        'opacity': 0.6,
                        'dstPath': `./storage/private/${req.file.filename}`
                    }
        
                    watermark.addWatermark(path.join(__dirname, `../storage/private/${req.file.filename}`), 
                                            path.join(__dirname, `../storage/watermark/${req.Usuario.watermark.marca}`), 
                                            options)
                }

               /* if(req.Usuario.watermark.tipo == "Texto"){
                    const options = {
                        'text': req.Usuario.watermark.marca,
                        'textSize': 8,
                        'dstPath': `./storage/private/${req.file.filename}`
                    }
        
                    watermark.addTextWatermark(path.join(__dirname, `../storage/private/${req.file.filename}`), 
                                            options)

                }*/
                                            if (req.Usuario.watermark.tipo == "Texto") {
                                                const image = await Jimp.read(path.join(__dirname, `../storage/private/${req.file.filename}`));
                                                const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE); // Puedes cambiar el tipo y tamaño de la fuente según tus necesidades
                                    
                                                image.print(font, 20, 20, req.Usuario.watermark.marca, image.bitmap.width - 30); // Ajusta las coordenadas y el tamaño según sea necesario
                                    
                                                await image.opacity(0.6) // Ajusta la opacidad de la imagen completa
                                                            .writeAsync(`./storage/private/${req.file.filename}`);
                                            }
            }

            const Imagen = await dbConfig.Imagen.create(
                {
                    nombre: req.file.filename,
                    estado: req.body.Estado,
                    formato: req.file.mimetype,
                    tamaño: req.file.size,
                    resolucion: req.body.resolucion,
                    derecho_autor: req.body.Derecho_Autor,
                    usuario_id: req.body.usuario_id
                });

        let etiquetaId = null;
        if (req.body.Etiquetas) {
        const [etiqueta, created] = await dbConfig.Etiqueta.findOrCreate({
        where: { nombre: req.body.Etiquetas.toLowerCase() },
        defaults: { nombre: req.body.Etiquetas.toLowerCase() }
        });
        etiquetaId = etiqueta.id;
        }

        const Publicacion = await dbConfig.Publicacion.create({
            titulo: req.body.Titulo,
            categoria: req.body.Categoria,
            fecha_creacion: Date.now(),
            usuario_id: req.body.usuario_id,
            imagen_id: Imagen.id,
            etiqueta_id: etiquetaId,
            estado: req.body.Estado
          });
          await dbConfig.Etiqueta.update({
            publicacion_id : Publicacion.id},
            {where : { id:etiquetaId} 
        })
          if (etiquetaId) {
            await Publicacion.update({ etiqueta_id: etiquetaId }, { where: { id: Publicacion.id } });
        }


            if(Publicacion)
                res.redirect("/Home")
            else
                res.json("No se pudo ingresar la publicacion")
        } catch (error)  {
            res.status(500).json({
              message: "Ocurrió un error al logear.",
              error: error.message,
              stack: error.stack
            });
        }
    },

    // ---------------------------------------------
    // Mostrar una publicacion para actualizar
    // ---------------------------------------------

    async updateShow(req,res){
        try {
                const publicacion = await dbConfig.Publicacion.findOne(
                {
                    include: ["Imagenes","Etiquetas"],
                    where: {
                        id: req.params.id
                    }
                }
            )

                if(publicacion)
                    res.render("Publicacion/Update",{Publicacion: publicacion,Usuario: req.Usuario,MyTitle: "Actualizar Publicacion"})
                    // res.json(publicacion)
                else
                    res.json("No se pudo actualizar")

        } catch (error)  {
            res.status(500).json({
              message: "Ocurrió un error al logear.",
              error: error.message,
              stack: error.stack
            });
        }
    },

    // ---------------------------------------------
    // Actulizar una publicacion
    // ---------------------------------------------

    async update(req,res){
        try {
                const updatePost = await dbConfig.Publicacion.update(
                    {
                        titulo: req.body.Titulo,
                        categoria: req.body.Categoria,
                    },
                    {
                        where: {
                            id: req.body.publicacion_id
                        }
                    }
                ) 

                const updateTag = await dbConfig.Etiqueta.update(
                    {
                        nombre: req.body.Etiquetas.toLowerCase()
                    },
                    {
                        where: {
                            id: req.body.etiqueta_id
                        }
                    }
                )

                if(updatePost)
                    res.redirect("/Home")
                else
                    res.json("No se pudo actualizar")

        } catch (error) {
            res.status(500).json({
              message: "Ocurrió un error al logear.",
              error: error.message,
              stack: error.stack
            });
        }
    },

    // ---------------------------------------------
    // Eliminar Una publicacion
    // ---------------------------------------------

    async delete(req, res) {
        
        try {
            const publicacion = await dbConfig.Publicacion.findOne({
              include: ["Imagenes", "Etiquetas"],
              where: {
                id: req.params.id
              }
            });
        
            if (!publicacion) {
              throw new Error("Publicación no encontrada");
            }
        
            if (publicacion.Imagenes.estado === "Protegido") {
              try {
                fs.unlinkSync(path.join(__dirname, `../storage/private/${publicacion.Imagenes.nombre}`));
              } catch (err) {
                console.error(`Error al eliminar el archivo protegido: ${err.message}`);
              }
            } else if (publicacion.Imagenes.estado === "Publico") {
              try {
                fs.unlinkSync(path.join(__dirname, `../storage/public/${publicacion.Imagenes.nombre}`));
                fs.unlinkSync(path.join(__dirname, `../storage/public_watermark/${publicacion.Imagenes.nombre}`));
              } catch (err) {
                console.error(`Error al eliminar el archivo público: ${err.message}`);
              }
            }
        
            // Eliminar la imagen
            await dbConfig.Imagen.destroy({ where: { id: publicacion.Imagenes.id } });
        
            // Eliminar la etiqueta si existe
            if (publicacion.Etiqueta) {
              await dbConfig.Etiqueta.destroy({ where: { id: publicacion.Etiqueta.id } });
            }
        
            // Eliminar la publicación
            await dbConfig.Publicacion.destroy({ where: { id: req.params.id } });
        
            res.redirect("/Home");
          } catch (error) {
            res.status(500).json({
              message: "Ocurrió un error al eliminar.",
              error: error.message,
              stack: error.stack
            });
          }
        },
    
    // ---------------------------------------------
    // Buscar Una publicacion publica
    // ---------------------------------------------

   /* async search(req,res){
        try {
            const buscar = await dbConfig.Etiqueta.findAll(
                {
                    include: ["Publicaciones"],
                    where: {
                        Nombre: {
                            [Op.like]: "%"+req.body.search.toLowerCase()+"%"
                          }
                    }
                }
            )

            const publicaciones = []
 

            for(let a = 0; a < buscar.length; a++)
            {
                const post = await dbConfig.Publicacion.findOne(
                    {
                        include: {
                            association: "Imagenes",
                            where: {
                                Estado: "Publico"
                            }
                        },
                        where: {
                            id: buscar[a].Publicaciones.id
                        }
                    }
                )
                if(post != null)
                {
                    publicaciones.push(post)
                }
                
            }


            if(publicaciones)
                res.render("Public/Public",{Publicacion: publicaciones,MyTitle: "Buscar Publicaciones"})
        } catch (error) {
            res.status(500).json({
              message: "Ocurrió un error al logear.",
              error: error.message,
              stack: error.stack
            });
        }
    },*/

    // ---------------------------------------------
    // Buscar una publicacion de home
    // ---------------------------------------------

    async searchHome(req,res){
        try {
                const buscar = await dbConfig.Etiqueta.findAll(
                    {
                        include: ["Publicaciones"],
                        where: {
                            Nombre: {
                                [Op.like]: "%"+req.body.search.toLowerCase()+"%"
                            }
                        }
                    }
                )

                const publicaciones = []
    

                for(let a = 0; a < buscar.length; a++)
                {
                    const post = await dbConfig.Publicacion.findOne(
                        {
                            include: ["Imagenes","Valoraciones","Usuario","Comentario","Etiquetas"],
                            where: {
                                id: buscar[a].Publicaciones.id
                            }
                        }
                    )
                    if(post != null)
                    {
                        publicaciones.push(post)
                    }
                    
                }     
                     

            if(buscar)
            {
                res.render("Publicacion/Buscar",{Publicacion: publicaciones, Usuario: req.Usuario,MyTitle: "Buscar Publicacion"})

                // res.json(buscar)
            }

        } catch (error)  {
            res.status(500).json({
              message: "Ocurrió un error al logear.",
              error: error.message,
              stack: error.stack
            });
        }
    }

}