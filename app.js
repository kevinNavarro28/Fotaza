'use strict'

const express = require('express'),
        app = express(),
        router = require('./router/router'),
        port = ( process.env.HTTP_PORT || 8080 ),
        viewDir = `${__dirname}/views`,
        publicDir = express.static(`${__dirname}/publics`),
        publicStorage = express.static(`${__dirname}/storage`),
        cookieParser= require('cookie-parser'),
        { connection } = require( './database/db_con' )

        app.set("port",port)
            .set( 'view engine','pug' )
            .set("views",viewDir)
            .use(cookieParser())
            .use( express.json() )
            .use(express.urlencoded({extended:false}) )
            .use(publicDir)
            .use(publicStorage)
            .use(router)
            


        app.listen( app.get("port"),()=>
        { 
            console.log(`inciando en el puerto ${app.get('port')}`)
            connection.con()
        })