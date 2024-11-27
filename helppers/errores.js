module.exports = {

    error404(req, res, next){
        res.render('Error/error404')
        next()
    }


}