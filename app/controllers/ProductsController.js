'use strict'

const Product = require('../models/Product');
const Category = require('../models/Category');
const slugify = require('slugify');
const { validationResult } = require('express-validator');
const multer  = require('multer');
const upload = multer({ dest: process.env.PUBLIC_PATH });
const AppHelper = require('../../AppHelper');
class ProductsController {

    /**
     *@GET 
     */
    index(req, res){

    }

    /**
     * @GET 
     */
    create(req, res){

        Category
        .find()
        .then((categories) => {
            res.render('cms/products/create', {
                layout: 'cms/layouts/app',
                uploadImage: true,
                path: '/cms/products/create',
                pageTitle: 'Create Product',
                categories: categories,
                oldInput: { name: '', price: '', description: '', inStock: '', image: ''},
                validationErrors: [],
            });

        }).catch((err) => {
            console.error(new Error('Error: ', err));
        });
    }


    
    /**
     * @POST
     */
    store(req, res){
        const name = req.body.name;
        const price = req.body.price;
        const description = req.body.description;
        const inStock = req.body.inStock;
        const image = req.file;
        const slug = slugify(name);
        const category_slug = req.body.category_slug
        const errorMessage = validationResult(req);
        console.log(image)


        if(!errorMessage.isEmpty()){
                
            return Category
                .find()
                    .then((categories) => {
                        return res.status(422).render('cms/products/create', {
                            layout: 'cms/layouts/app',
                            uploadImage: true,
                            categories: categories,
                            errorMessage: errorMessage.array()[0].msg,
                            oldInput: { name: name, price: price, description: description, inStock: inStock, image: image},
                            validationErrors: errorMessage.array()
                        });

                    }).catch((err) => {
                        throw new Error(err);
                    });

        }

        // if image is undefined then show that show status 422(fields filled incorrectcly)
        if(!image){        
            // return Category
            // .find()
            //     .then((categories) => {
            //         return res.status(422).render('cms/products/create', {
            //             layout: 'cms/layouts/app',
            //             uploadImage: true,
            //             categories: categories,
            //             errorMessage: 'Attched file is not an image.',
            //             oldInput: { name: name, price: price, description: description, inStock: inStock, image: image},
            //             validationErrors: [],
            //         });

            //     }).catch((err) => {
            //         throw new Error(err);
            //     });
            const product = new Product({
                name: name,
                description: description,
                price: price,
                inStock: inStock,
                image: process.env.DEFAULT_IMG, 
                slug: slug,
                category_slug: category_slug
            });
            product.path = product.urlPath();
    
            return product
                .save('products')
                .then( result => {
                    console.log('Created Product'); 
                    Product.find({})
                    .then( products => {
                        res.render('cms/products/', {layout: 'cms/layouts/app', products: products});
                    })
                    .catch( err => console.error(err));
                })
                .catch( err => console.error(err));
        }//end if(!image)


        console.log(image);
        const imagePath = image.filename;

        // name, price, description, image, slug category_id, _id
        const product = new Product({
            name: name,
            description: description,
            price: price,
            inStock: inStock,
            image: imagePath, 
            slug: slug,
            category_slug: category_slug
        });

        product
            .save('products')
            .then( result => {
                console.log('Created Product'); 
                Product.find({})
                .then( products => {
                    res.render('cms/products/', {layout: 'cms/layouts/app', products: products});
                })
                .catch( err => console.error(err));
            })
            .catch( err => console.error(err));
    }// End store


    /**
     * @GET
     */
    edit(req, res){
        Product.findOne({_id: req.params.id})
            .then( product => {
                Category.find({}).then( categories => {
                    res.render('cms/products/edit', {
                        uploadImage: true,
                        layout: 'cms/layouts/app',
                        product: product,
                        categories: categories
                    });

                }).catch(err => console.error('Error: ', new Error(err)));
            })
            .catch(err=>console.error(new Error(err)));
    }// End Edit



    /**
     * @PUT
     */
    update(req, res){
        const name        = req.body.name;
        const price       = req.body.price;
        const description = req.body.description;
        const image       = req.file;
        const inStock     = req.body.inStock;
        const slug        = slugify(name);
        const category_slug = req.body.category_slug;

        console.log(req.params.id)
        // if not updating the image then do this.
        if(!image){
            Product.findById(req.params.id)
                .then((product) => {
                    product.updateOne({
                        name: name,
                        description: description,
                        price: price,
                        inStock: inStock,
                        slug: slug,
                        category_slug: category_slug
                    }).then((result) => {
                        res.redirect('/cms/products');
                    }).catch((err) => {
                        console.error(new Error(err));
                    });
                }).catch((err) => {
                    console.error(new Error(err));
                    
                });        
        }else if (image){
            // find the product
            Product.findOne({_id:req.params.id})
                    .then((product) => {
                        // if there is an image in product delete the image from database
                        if(product.image){
                            // delete current image from the server.
                            AppHelper.deleteFile(`${process.env.PRODUCT_IMAGES_PATH}${product.image}`);
                        }
                        // upload to the server the new file
                        
                        // update the product stuff
                        product.name = name;
                        product.price = price;
                        product.description = description;
                        product.image = image.filename;
                        product.inStock = inStock;
                        product.slug = slug;
                        product.category_slug = category_slug;
                        product.save((err, p) => {
                            if(err) throw new (err);
                            res.redirect('/cms/products');
                        })
                    }).catch((err) => {
                        throw new (err);
                    });

        }



    }// End update



    /**
     * @GET
     */
    show(req, res){
        const category_slug = req.params.category_slug;
        const slug = req.params.product_slug;
        Product.findOne({slug: slug})
        .then((product) => {
            console.log(product)
            res.render('products/show', {product: product});
        }).catch((err) => {
            console.error(err);
        });
    }// End Show


    /**
     * @DELETE
     */
    destroy(req, res, next){
        Product.findOneAndDelete({_id: req.params.id})
        .then((product) => {
            if(product.image !== process.env.DEFAULT_IMG){
                AppHelper.deleteFile(`${process.env.PUBLIC_PATH}/images/${product.image}`);
            }
            res.status(200).json({message: 'Success!'});
        }).catch((err) => {
            res.status(500).json({message: 'Deleting product failed'});
        });
    }

}

module.exports = new ProductsController;