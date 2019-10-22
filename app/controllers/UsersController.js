'use strict'
const crypto = require('crypto');
const slugify = require('slugify');
const User = require('../models/User');
const Order = require('../models/Order');
const request = require('request');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator')
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:process.env.SEND_GRID_API,
    }
}));
const AppHelper = require('../../AppHelper');


class UsersController {

    /**
     *@GET 
     */
    index(req, res){

    }

    
    /**
     * @GET
     */
    login(req, res, next){

        res.render('users/login',{
            path: '/login',
            pageTitle: 'Login',
            oldInput: { email: '', password: ''},
            validationErrors: []
        });
    }

    
    /**
     * @POST
     */
    postLogin(req, res){
        const email = req.body.email;
        const password = req.body.password;

        const errorMessage = validationResult(req);

        if(!errorMessage.isEmpty()){
            console.log(errorMessage.array())
            return res.status(422).render('users/login', {
                errorMessage: errorMessage.array()[0].msg,
                oldInput: { email: email, password: password},
                validationErrors: errorMessage.array()

            });
        }

        User
        .findOne({email: email})
            .then((user) => {
                bcrypt.compare(password, user.password)
                    .then( (doMatch) => {
                        if(doMatch){
                            // update login time
                            user.loggedInAt = AppHelper.currentDateAndTime();
                            user.save();
                            // put sessions in the database to know that user is logged.
                            req.session.isLoggedIn = true;
                            req.session.username = user.username;
                            req.session.user_id = user._id;
                            // if user is admin 
                            if(user._id == process.env.ADMIN_ID) req.session.isAdmin = true;
                            // Preventing the delay in showing the navbar
                            // because storing the session may take some time the page will be updated correctly
                            return req.session.save( (err) =>{
                                if(err) console.error(new Error(err));
                                // Flashing a success mesage
                                req.flash('success_msg', `Welcome back ${user.username}!`)
                                res.redirect('/');
                            });
                        }
                        // if password is not matching the password in the database.
                        res.redirect('/login');
                    }).catch((err) => {
                        console.error(new Error(err));

                    });
            
            }).catch((err) => {
                console.error(new Error(err));
            });
    }


    /**
     *@POST 
     */
    logout(req, res){
        req.session.destroy((err) => {
            res.redirect('/');
            console.error(err);
        });
    }

    /**
     * @GET
     */
    register(req, res, next){

        res.render('users/register', {
            oldInput: { username: '' ,email: '', password: '', confirmPassword: ''},
            validationErrors: [],

        });
    }


    
    /**
     * @POST
     */
    store(req, res){
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirm_password;
       
        const errorMessage = validationResult(req);
       
        if(!errorMessage.isEmpty()){
            console.log(errorMessage.array())
            return res.status(422).render('users/register', {
                errorMessage: errorMessage.array()[0].msg,
                oldInput: { username: username ,email: email, password: password, confirm_password: confirmPassword },
                validationErrors: errorMessage.array(),
            });
        }
       
        User.findOne({email: email})
        .then((userDoc) => {
            if(userDoc){
                   return res.redirect('/register');
            }
            // returning a promise 
            return bcrypt.hash(password, 12)
                .then( hashedPassword => {
                    const user = new User({
                        username: username,
                        email: email,
                        password: hashedPassword,
                        loggedInAt: AppHelper.currentDateAndTime(),
                        cart: { items: [] }
                    });
                    return user.save();
                })
                .then( result => {
                    // will be executed once saving is done.
                    res.redirect('/login');

                    return transporter.sendMail({
                        to: email,
                        from: process.env.DB_EMAIL,
                        subject: 'Signup succeeded!',
                        html: `<h1>You successfully signed up!</h1>`
                    });
                })
                .catch((err) => {
                    console.error(new Error(err));
                });
            })
            .catch((err) => {
                console.error(new Error(err));
            });

    }// End store



    /**
     *@GET
     */
    resetPasword(req, res){
        let errorMessage = req.flash('error_msg');
        res.render('users/reset_password',{
            errorMessage: errorMessage
        });
    }

    /**
     *@POST 
     */
    postResetPassword(req, res){
        crypto.randomBytes(32, (err, buffer) => {
            if(err){
                console.error(new Error(err));
            } 
            // Generating  token
            const token = buffer.toString('hex');
            // searching for a user with the email given.
            User.findOne({email: req.body.email})
                    .then((user) => {
                        if(!user){
                            req.flash('error_msg', 'No account with that email found');
                            return res.redirect(req.header('Referer'));
                        }
                        // if we found a user with that email send him an email with the reset link
                        user.resetToken = token;
                        user.resetTokenExpiration = Date.now() + 3600000;
                        return user.save()
                                    .then(result => {
                                        console.log(req.body.email)
                                        req.flash('success_msg', 'We have sent you a link to your email.')
                                        res.redirect('/');
                                        return transporter.sendMail({
                                            to: req.body.email,
                                            from: process.env.DB_EMAIL,
                                            subject: 'Reset Password',
                                            html: `
                                                <p> You requested password reset</p>
                                                <p> Click this <a href="${process.env.DB_URL}/new-password/${token}">link</a> to set a new password.</p>
                                            `,
                                        });
                                    })
                                    .catch((err) => {
                                        console.error(new Error(err));
                                    });

                    })
                    .catch((err) => {
                        console.error(new Error(err));
                    });

        });
    }


    /**
     *@GET 
     */
    newPassword(req, res){

        User.findOne({resetToken: req.params.token, resetTokenExpiration: {$gt: Date.now()}})
                .then((user) => {
                    res.render('users/new_password', {
                        user_id: user._id.toString(),
                        passwordToken: req.params.token,
                        errorMessage: req.flash('error_msg'),
                    });
                }).catch((err) => {
                    console.error(new Error(err));
                });

    }


    /**
     *@POST 
     */
    storeNewPassword(req, res){
        const password = req.body.password;
        const confirmPassword = req.body.confirm_password;
        const user_id = req.body.user_id;
        const passwordToken = req.body.password_token;
        User.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() },
            _id: user_id
            })
                .then((user) => {
                    if(password === confirmPassword){
                        // hash password
                        bcrypt.hash(password, 12)
                                .then((hashedPassword) => {
                                    // store the hashed password
                                    user.resetToken = undefined;
                                    user.resetTokenExpiration = undefined;
                                    user.password = hashedPassword;
                                    return user.save()
                                        .then((result) => {
                                            req.flash('success_msg', 'Successfully changed password')
                                            res.redirect('/');
                                        }).catch((err) => {
                                            console.error(new Error(err));
                                        });
                                }).catch((err) => {
                                    console.error(new Error(err));
                                });
                        
                    }else{
                        // Passwords not match
                        req.flash('error_msg', 'Passwords not match.')
                        res.redirect(req.header('Referer'));
                    }
                }).catch((err) => {
                    console.error(new Error(err));
                });
    }


    /**
     * @GET
     */
    edit(req, res, next){


        User.findById(req.params.id)
        .then( user => {
            res.render('cms/users/edit', {
                layout: 'cms/layouts/app',
                user: user,
                path: `/cms/users/${user._id.toString()}`,
                pageTitle: `Edit ${user.username}`,
                validationErrors: [],
            });
        })
        .catch( err => next(err));
    }// End Edit



    /**
     * @PUT
     */
    update(req, res, next){
        const username = req.body.username;
        const email = req.body.email;
        User
        .findByIdAndUpdate(req.params.id, {$set:{username: username, email: email}}, function(err, result){
            if(err) throw new (err)
            return res.redirect('/cms/users');
        });
    }// End update



    /**
     * @GET
     */
    show(req, res, next){

    }// End Show


    /**
     * @DELETE
     */
    destroy(req, res, next){
        User.findByIdAndDelete(req.params.id, (err, user)=>{
            if(err) throw new (err);
            return res.redirect('/cms/users');
        });
    }

}

module.exports = new UsersController;