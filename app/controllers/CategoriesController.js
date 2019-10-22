'use strict'

const Category = require('../models/Category');
const slugify = require('slugify');
const { validationResult } = require('express-validator');
const AppHelper = require('../../AppHelper');

class CategoriesController {

    /**
     *@GET 
     */
    index(req, res){
        // res.render('cms/categories/index', {
        //     layout: 'cms/layouts/app'
        // });
    }

    /**
     * @GET 
     */
    create(req, res){

        res.render('cms/categories/create', {
            layout: 'cms/layouts/app',
            uploadImage: true,
            path: '/cms/categories/create',
            uploadImage: true,
            pageTitle: 'Create Category',
            oldInput: { name: '', description: '', image: ''},
            validationErrors: [],
        });

    }


    
    /**
     * @POST
     */
    store(req, res){
        const name = req.body.name;
        const description = req.body.description;
        const image = req.file;
        const slug = slugify(name);

        const errorMessage = validationResult(req);

        if (!errorMessage.isEmpty()) {
            console.log(errorMessage.array());
            return res.status(422).render('cms/categories/create', {
                layout: 'cms/layouts/app',
                uploadImage: true,
                path: '/cms/categories/create',
                imagePath: process.env.CATEGORY_IMAGES_PATH,
                pageTitle: 'Create Category',
                oldInput: { name: '', description: '', image: ''},
                errorMessage: errorMessage.array()[0].msg, 
            });     
        }

        // if image included
        const category = new Category();
        if(image){
                category.name = name; 
                category.description = description; 
                category.image = image.filename; 
                category.slug = slug;
        }else if(!image){
                category.name = name; 
                category.description = description;
                category.image = process.env.DEFAULT_IMG;
                category.slug = slug;
        }

        category.save()
            .then( result => {
                console.log('Created Category');
                return res.redirect('/cms/categories');
            })
            .catch( err => {
                // console.error(err);
                console.log(err.errors);
                res.redirect(req.header('Referer'));
            });
    }// End store


    /**
     * @GET
     */
    edit(req, res, next){
        Category
        .findOne({_id: req.params.id})
        .then((category) => {
            res.render('cms/categories/edit', {
                layout: 'cms/layouts/app',
                path: `/cms/categories/${category._id.toString()}`,
                uploadImage: true,
                category: category
            });
        }).catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    }// End Edit



    /**
     * @PUT
     */
    update(req, res, next){
        const name = req.body.name;
        const description = req.body.description;
        const image = req.file;
        const slug = slugify(name);
        const errorMessage = validationResult(req);

        // If there is errors display them.
        if(!errorMessage.isEmpty()){
            return Category
            .findOne({_id: req.params.id})
            .then( (category) => {
                res.render('cms/categories/edit', {
                    layout: 'cms/layouts/app',
                    path: `/cms/categories/${category._id.toString()}`,
                    uploadImage: true,
                    errorMessage: errorMessage.array()[0].msg,
                    category: category
                });
            }).catch((err) => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
        }

        // select the category
        Category.findOne({_id: req.params.id})
                    .then((category) => {
                        // if updating image
                        if(image){
                            // if there is already an image in the category exists then delete the image
                            if(category.image && category.image !== process.env.DEFAULT_IMG){
                                AppHelper.deleteFile(`${process.env.CATEGORY_IMAGES_PATH}${category.image}`);
                            }
                            // update the current category
                            category.name = name;
                            category.description = description;
                            category.image = image.filename;
                            category.slug = slug;
                            category.save((err, c) => {
                                if(err) throw new (err);
                                return res.redirect('/cms/categories');
                            });
                        }else if (!image){
                            // update the current category
                            category.name = name;
                            category.description = description;
                            category.slug = slug;
                            category.save((err, c) => {
                                if(err) throw new (err);
                                return res.redirect('/cms/categories');
                            });
                        }
 
                    }).catch((err) => {
                        next(err);                        
                    });
    }// End update



    /**
     * @GET
     */
    show(req, res){

    }// End Show


    /**
     * @DELETE
     */
    destroy(req, res, next){
        Category.findOneAndDelete({_id: req.params.id})
        .then((category) => {
            if(category.image && category.image !== process.env.DEFAULT_IMG){
                AppHelper.deleteFile(`${process.env.CATEGORY_IMAGES_PATH}${category.image}`);
            }
            res.redirect('/cms/categories');
        }).catch((err) => {
            next(err);
        });
    }

}

module.exports = new CategoriesController;