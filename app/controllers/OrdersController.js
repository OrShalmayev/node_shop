'use strict'

const Product = require('../models/Product');
const Category = require('../models/Category');
const slugify = require('slugify');
const AppHelper = require('../../AppHelper');
const Order = require('../models/Order');


class OrdersController {

    /**
     *@GET 
     */
    index(req, res){
        Order
        .find({})
            .then((orders) => {
                res.render('cms/orders/index', {layout: 'cms/layouts/app', orders: orders})
            }).catch((err) => {
                console.error(new Error(err));            
            });
    }

    /**
     * @GET 
     */
    create(req, res){

    }


    
    /**
     * @POST
     */
    store(req, res, next){

        // req.user
        // .populate('cart.items.product_id')
        // .execPopulate()
        // .then((user) => {
        //     const products = user.cart.items.map( i => {
        //         return {product_data: {...i.product_id._doc} , quantity: i.quantity };
        //     });
        //     const order = new Order({
        //         user: {
        //             email: req.user.email,
        //             user_id: req.user
        //         },
        //         products: products,
        //     });//end new order

        //     return order.save();
        
        // })
        // .then((result) => {
        //     return req.user.clearCart();
        // })
        // .then(result => {
        //     res.redirect('/');            
        // })
        // .catch((err) => {
        //     console.error(new Error(err));
        // });

    }// End store


    /**
     * @GET
     */
    edit(req, res){
        Order.findOne({_id: req.params.id}, (err, order) => {
            if(err) throw new (err);
            // Getting all products
            Product.find({}).then((products) => {
                console.log(products);
                res.render('cms/orders/edit', {
                    layout: 'cms/layouts/app',
                    path: `/cms/orders/${order._id}`,
                    pageTitle: `Edit Order Number: ${order._id}`,
                    products: products,
                    order: order,
                    validationErrors: []
                })
            }).catch((err) => {
                throw new (err)
            });

        });

    }// End Edit



    /**
     * @PUT
     * 
     ***In construction**
     */
    update(req, res, next){
        const order_id = req.params.order;
        const product_id = req.params.product;
        console.log(product_id)
        Order.findOne({_id: order_id}).then((order) => {
            order.products.forEach( product => {
                console.log(product);
                res.redirect(req.header('Referer'))
            });
        }).catch((err) => {
            
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
        Order
        .findByIdAndDelete(req.params.id)
            .then((result) => {
                res.redirect(req.header('Referer'));
            }).catch((err) => {
                next(err);
            });
    }

}

module.exports = new OrdersController;