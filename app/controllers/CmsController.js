const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const AppHelper = require('../../AppHelper');
class CmsController {

    constructor(req, res, next){

    }
    
    /**
     * @GET
     * 
     */
    index(req, res, next){
        res.render('cms/pages/index', 
        {
            layout: 'cms/layouts/app',
            customScript: `<script src="/js/dashboard.js"></script>`,
            path: '',
        });
    }


    /**
     *@GET 
     */
    showCategories(req, res, next){
        Category.find()
        .then( categories => {
            res.render('cms/categories/', {
                layout: 'cms/layouts/app',
                categories: categories,
                imagePath: process.env.CATEGORY_IMAGES_PATH,
                path: '',

            });
        })
        .catch( err => next(err));
    
    }// end showProducts



    /**
     *@GET 
     */
    showProducts(req, res, next){
        Product.find()
        .then( products => {
            res.render('cms/products/', {
                layout: 'cms/layouts/app',
                products: products,
                path: '',
                });
        })
        .catch( err => next(err));
    
    }// end showProducts


    /**
     *@GET 
     */
    showCustomers(req, res, next){
        User.find()
        .then( users => {
            res.render('cms/users/', {
                layout: 'cms/layouts/app',
                users: users,
                path: '/cms/users',
                pageTitle: 'Customers',
                AppHelper: AppHelper,
            });
        })
        .catch( err => next(err));
    
    }// end showProducts


}


module.exports = new CmsController;