'use strict'

const Product = require('../models/Product');
const Category = require('../models/Category');
const LIMIT_PER_PAGE = 2;

class ShopController {
    
    /**
     * @GET
     */
    async index(req, res, next){

        try{
            const categories = await Category.find({});
            res.render('shops/index', {categories: categories});
        }catch(err){
            next(err)
        }

    }//end index-


    /**
     * @GET
     */
    async show(req, res, next){
        try{
            //page cant be less than 1
            let category_slug = req.params.category_slug;
            let totalProducts;
            let page = (req.query.page < 1 || req.query.page > totalProducts) ? 1 : req.query.page;
            const numProducts = await Product.find({}).countDocuments();
            totalProducts = numProducts;
            const products = await Product.find({category_slug: category_slug}).skip( (page - 1) * LIMIT_PER_PAGE).limit(LIMIT_PER_PAGE)
                res.render('shops/show', {
                    pageTitle: `${category_slug} Products`, 
                    path: `/shop/${category_slug}`,
                    products: products,
                    totalProducts: totalProducts,
                    page: page,
                    hasNextPage: LIMIT_PER_PAGE * page < totalProducts,
                    hasPrevPage: parseInt(page) === 1 ? false : true,
                    lastPage: Math.ceil(totalProducts / LIMIT_PER_PAGE),
                });
        }catch(err){
            next(err)
        }

    }



}

module.exports = new ShopController;