module.exports = (req, res, next)=>{
    if( req.cookies['x-access-token']){
        req.loged = true
        next()
    }
    else{
            req.loged = false
            next()
    }
}