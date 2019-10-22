const Order = require('../models/Order');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

class ProfileController{

    /**
     *@GET 
     */
    index(req, res){
        res.render('profile/index');
    }

        /**
     *@GET 
     */
    orders(req, res){
        Order
        .find({'user.user_id': req.user._id})
        .then((orders) => {
            console.log(orders);
            res.render('profile/orders', {
                orders: orders
            }); 
        }).catch((err) => {
           console.error(new Error(err)); 
        });
    }

    /**
     *@GET 
     */
    wishList(req, res){
        res.render('profile/wishlist');
    }


     
    /**
     *@GET
     */
    updateUser(req, res){
        // user can see only his details and not others!
        let errorMessage = req.flash('error_msg')[0];
        let successMessage = req.flash('success_msg')[0];
        User
        .findOne({_id: req.session.user_id})
        .then((user) => {
            res.render('profile/update_user_settings',{
                loggedUser: user,
                errorMessage: errorMessage,
                successMessage: successMessage,
            });
        }).catch((err) => {
            
        });
    }


        /**
     *@PUT
     */
    updateUsername(req, res){
        // user can see only his details and not others!
        User.findOne({_id: req.session.user_id})
                .then( user => {
                    // username is already taken.
                    if(user.username === req.body.username){
                        req.flash('error_msg', 'Username is taken.');
                        return res.redirect(req.header('Referer'));
                    }else{
                        // if not taken then allow updating.
                        user.username = req.body.username;
                        return user.save()
                                    .then((result) => {
                                        req.flash('success_msg', 'Username updated successfully.');
                                        res.redirect(req.header('Referer'));
                                    }).catch((err) => {
                                        console.error(new Error(err));
                                    });
                    }

                })
                .catch(err => console.error(new Error(err)));
    }


            /**
     *@PUT
     */
    updateUserEmail(req, res){
        // if email is laready exists in db then log to user alert

        User
        .findOne({_id: req.session.user_id})
        .then((user) => {
            if(user.email === req.body.email){
                req.flash('error_msg', 'Email already registered.');
                return res.redirect(req.header('Referer'));
            }else{
                // if email doesnt exists then allow updating.
                user.email = req.body.email;
                return user.save()
                            .then( result => {
                                req.flash('success_msg', 'Email updated successfully.');
                                res.redirect(req.header('Referer'));
                            })
                            .catch(err =>{
                                console.error(new Error(err));
                            });
            }
            
        }).catch((err) => {
            console.error(new Error(err));
        });
    }


            /**
     *@PUT
     */
    updateUserPassword(req, res){
        // user can see only his details and not others!
        User.findById(req.session.user_id, (err, user) => {
            if(err) console.error(new Error(err));
            bcrypt.hash(req.body.password, 12)
                .then( hashedPassword => {
                    user.password =  hashedPassword;
                    return user.save()
                        .then((result) => {
                            req.flash('success_msg', 'Password updated successfully.');
                            res.redirect(req.header('Referer'));
                        })
                        .catch((err) => {
                            console.error(new Error(err));
                        });
                })
                .catch((err) => {
                    console.error(new Error(err));
                });

        })//end User.findById
        

    }



    
    /**
     * @GET
     */
    showInvoice(req, res, next){
        const order_id = req.params.order_id;
        Order.findById(order_id)
                .then((order) => {
                    if(!order){
                        return next(new Error('No order found.'));
                    }
                    // if the user is not the same user that ordered that item then throw 403 status(unauthorized)
                    if(order.user.user_id.toString() !== req.user._id.toString()){
                        // return res.status(403).render('unauthorized', {layout: 'unauthorized'});
                        return res.status(403).redirect('/403');
                    }

                    const invoiceName = `invoice-${order_id}.pdf`;
                    const invoicePath = path.join('data', 'invoices', invoiceName);

                    const pdfDoc = new PDFDocument();
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `attachment; filename="${invoiceName}"`);
                    pdfDoc.pipe(fs.createWriteStream(invoicePath));
                    pdfDoc.pipe(res);

                    pdfDoc.fontSize(26).text('Invoice', {
                        underline:true
                    });
                    pdfDoc.text('--------------------------------------------');
                    let totalPrice = 0;
                    order.products.forEach( prod => {
                        pdfDoc.fontSize(14).text(prod.product_data.name + ' - ' + prod.quantity + ' x ' + ' $ ' + prod.product_data.price);
                        totalPrice += prod.quantity * prod.product_data.price;
                    });
                    pdfDoc.text('--------------------------------------------');

                    pdfDoc.fontSize(20).text(`Total Price $ ${totalPrice}`);




                    pdfDoc.end();

                    // fs.readFile(invoicePath, (err, data)=>{
                    //     if(err){
                    //         return next(err);
                    //     }
                    //     res.setHeader('Content-Type', 'application/pdf');
                    //     res.setHeader('Content-Disposition', `attachment; filename="${invoiceName}"`);
                    //     res.send(data);
                    // });
                    // const file = fs.createReadStream(invoicePath);

                    // file.pipe(res);

                }).catch((err) => {
                    next(err)
                });

        
    }// End showInvoice

}

module.exports = new ProfileController;