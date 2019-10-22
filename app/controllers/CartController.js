'use strict'

const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const slugify = require('slugify');
const stripe = require("stripe")("sk_test_rO5MV2VagIefrqzQ12BfK1SF005bjEyypP");
const cors = require('cors')({
    origin: true
});
const axios = require('axios');

class CartController {


    /**
     *@GET 
     */
    async index(req, res) {
        let sessionId;
        try {
            // console.log(req.user)
            if (req.user) {
                const user = await req.user.populate('cart.items.product_id').execPopulate();
                const products = user.cart.items;
                let mappedProducts = products.map(item => ({
                    [item.product_id._id]: item.quantity
                }));
                const response = await axios.post('http://localhost:3000/checkout', products); // stripe
                sessionId = response.data.id; // stripe
                // console.log(req.user.cart.items);
                // console.log(mappedProducts)
                res.render('cart/index', {
                    products: products,
                    sessionId: sessionId,
                    mappedProducts: mappedProducts,
                    csrf: req.csrfToken(),
                });
            } else {
                res.render('cart/index', {
                    products: [],
                    sessionId: sessionId,
                    csrf: req.csrfToken(),
                });
            }

        } catch (err) {
            console.error(new Error(err));
        }

    }


    postCheckout(req, res, next) {
        cors(req, res, () => {
            let test = req.body.map(item => item);
            let arr = [];
            for (let i = 0; i < test.length; i++) {
                arr.push({
                    name: test[i].product_id.name,
                    description: test[i].product_id.description,
                    amount: test[i].product_id.price,
                    currency: "usd",
                    quantity: test[i].quantity
                })
            }
            console.log("req user", test);
            stripe.checkout.sessions.create({
                success_url: "http://127.0.0.1:3000",
                cancel_url: "https://example.com/cancel",
                payment_method_types: ["card"],
                line_items: arr
            }, function (err, session) {
                // asynchronously called
                if (err) console.error(err);
                res.send(session)
            });
        });
    }





    // /**
    //  *@GET 
    //  */
    // checkout(req, res)
    // {


    //     const checkoutCss = `<link rel="stylesheet" href="/css/checkout.css">`;
    //     req.user
    //     .populate('cart.items.product_id')
    //     .execPopulate()
    //     .then((user) => {
    //         const products = user.cart.items;
    //         console.log(products)
    //         let totalSum = 0;
    //         products.forEach( p => {
    //             totalSum += p.quantity * p.product_id.price;
    //         });
    //         res.render('cart/checkout', {
    //             path: `/checkout`,
    //             pageTitle: `Checkout`,
    //             checkoutCss: checkoutCss,
    //             products: products,
    //             totalSum: totalSum,
    //             stripeCss: true,
    //         });
    //     }).catch((err) => {
    //         console.error(new Error(err));
    //     });

    // }


    /**
     * @GET 
     */
    create(req, res) {

    }

    /**
     * @POST
     */
    storeProduct(req, res) {
        // check if user is logged in if not dont allow him to add to cart
        if (req.session.user_id) {
            let product_id = req.body.product_id;
            Product
                .findById(product_id)
                .then((product) => {
                    return req.user.addToCart(product);
                })
                .then((result) => {
                    console.log(result);
                    res.redirect(req.header('Referer'));
                });
        } else {
            // user is not logged in then redirect o login page.
            res.redirect('/login');
        }

    } // End store




    /**
     * @GET
     */
    edit(req, res) {

    } // End Edit



    /**
     * @PUT
     */
    update(req, res) {

    } // End update


    async updateQty(req, res, next) {
        try {
            if (req.query.op) {
                const product = await Product.findById(req.params.id);
                const user = await User.findById(req.user._id);
                const updatedUser = await user.addToCart(product, req.query.op);
                let qty = updatedUser.cart.items[0].quantity;
                console.log(product)
                res.status(201).json({
                    message: 'success!',
                    total: product.price * qty
                })
            }
        } catch (err) {
            console.error(new Error(err));
        }
    }

    /**
     * @GET
     */
    show(req, res) {

    } // End Show


    /**
     * @DELETE
     */
    destroy(req, res) {
        let id = req.params.id;
        req.user
            .removeFromCart(id)
            .then((result) => {
                console.log(result);
                res.redirect(req.header('Referer'));
            }).catch((err) => {
                console.error(new Error(err));
            });

    }

}

module.exports = new CartController;