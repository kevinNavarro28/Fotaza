const { dbConfig } = require( '../database/db_con' ),
        bcrypt = require( 'bcrypt' ),
        jwt = require( 'jsonwebtoken' ),
        authConf = require( '../config/authConfig' )

module.exports = {

    // ---------------------------------------------
    //  Iniciar Sesion
    // ---------------------------------------------

    async login( req,res ){
        try {
            const {Email, Clave} = req.body
            const Usuario = await dbConfig.Usuario.findOne( 
                {
                    where: {
                        email: Email
                        
                    }
                }
            )

            
            if( !Usuario ){
                res.render( 'Login/Login', {error: 'Email o contraseña incorrectos.',MyTitle: "Login"} )
            }else{
                if( bcrypt.compareSync( Clave, Usuario.clave ) ){

                    // devolver token
                    const token = await jwt.sign( {Usuario: Usuario}, authConf.secret, {
                        expiresIn: authConf.expire
                    } )

                    let options = {
                        path:"/",
                        sameSite:true,
                        maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                        httpOnly: true, // The cookie only accessible by the web server
                    }
                    
                    res.cookie( 'x-access-token', token, options )
                                       
                    res.redirect( '/Home' ) 

                }else{
                    res.render( 'Login/Login',{ error: 'Email o contraseña incorrectos.',MyTitle: "Login"} )
                }
            }

        } catch ( error ) {
            res.status(500).json({
              message: "Ocurrió un error al logear.",
              error: error.message,
              stack: error.stack
            });
        }
    },

    // ---------------------------------------------
    // Registrarse
    // ---------------------------------------------

    async signup( req,res ){

        const fecha = new Date(), 
        fecha_nacimiento = new Date(req.body.fecha_nac)
        fecha.setFullYear(fecha.getFullYear() - 18)

        if( fecha_nacimiento > fecha ){
            return res.render( 'Login/Registrarse', { error: 'Necesita ser mayor de edad para registrarse' } )
        }


        const existUsuario = await dbConfig.Usuario.findOne( 
            {
                where: {
                    email: req.body.Email
                }
            }
        )
        
        if( existUsuario ){
            res.render( 'Login/Registrarse', { existUsuario: true ,MyTitle: "Registrarse"} )
        }else{
            const hash = bcrypt.hashSync( req.body.Clave, parseInt( authConf.round ) )
        
            const usuario = await dbConfig.Usuario.create( 
                    {
                        nombre: req.body.Nombre,
                        apellido: req.body.Apellido,
                        email: req.body.Email,
                        clave: hash,
                        telefono: req.body.Telefono,
                        fecha_nac: req.body.fecha_nac,
                        avatar: "null" ,
                        interes: req.body.Interes,
                        nickname: req.body.Nickname
                        
                    }
            )

            if( usuario ){
                return res.render( 'Login/Login', {registro: true , success:"Se Registro Exitosamente",MyTitle: "Login"} )
            }
        }
        
    }
}