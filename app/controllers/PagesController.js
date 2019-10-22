const Controller = require('./Controller');

const Category = require('../models/Category');

class PagesController extends Controller{

    
    /**
     * @GET
     */
    async index(req, res, next)
    {
        try{

            const categories = await Category.find({});
            res.render('pages/index', {
                categories: categories,
                customStyle: {
                    lightBox: `<link rel="stylesheet" href="/css/lightbox.css">`
                },
                successMessage: req.flash('success_msg')[0],
                errorMessage: '',
            });//end render

        }catch(err){
            next(err);
        }

    }//end index


    /**
     * @GET
     */
    about(req, res, next)
    {
        res.render('pages/about');
    }


    /**
     * @GET
     */
    contact(req, res, next)
    {
        res.render('pages/contact');
    }


    /**
     * @GET
     */
    serverError(req, res, next){
        res.status(500).render('500', {layout: '500'});
    }


    /**
     * @GET
     */
    pageNotFound(req, res, next){
        res.status(404).render('404', {layout: '404'});
    }



    /**
     * @GET
     */
    unauthorized(req, res, next){
        res.status(403).render('unauthorized', {layout: 'unauthorized'});
    }


}

module.exports = new PagesController;