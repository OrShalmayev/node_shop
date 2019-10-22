const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique:true,
        trim: true,
        lowercase:true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    password: { 
        type: String, 
        required: true,
        trim: true

    },
    loggedInAt:{
        type: Date,

    },
    created_at    : { type: Date },
    updated_at    : { type: Date },
    cart: { 
        items: [{
            product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true}
        }], 
    },
},


);


userSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
  });

/******************************USER MODEL METHODS *********************************/
// AddToCart Method
userSchema.methods.addToCart = function(product, op = '') {
        const cartProductIndex = this.cart.items.findIndex( cp => {
            return cp.product_id.toString() === product._id.toString();
        });

        let newQty = 1;
        const updatedCartItems = [...this.cart.items];

        // if product already exists in the cart..
        if(cartProductIndex >= 0){
            if(op === 'minus'){
                newQty = this.cart.items[cartProductIndex].quantity - 1;

            }else if (op === 'plus'){
                newQty = this.cart.items[cartProductIndex].quantity + 1;

            }else{
                newQty = this.cart.items[cartProductIndex].quantity + 1;
            }
            // quantity cant be less then 1
            if(newQty < 1) newQty = 1;
            updatedCartItems[cartProductIndex].quantity = newQty;
        }else{
            updatedCartItems.push({
                product_id: product._id,
                quantity: newQty
                });
        }
        const updatedCart = { 
            items: updatedCartItems,
        };

        this.cart = updatedCart;
        
        return this.save();
};// End addToCart

// removeFromCart
userSchema.methods.removeFromCart = function(id){
    const updatedCartItems = this.cart.items.filter(item => {
        return item.product_id.toString() !== id.toString();
    });
    console.log(updatedCartItems);
    this.cart.items = updatedCartItems;
    return this.save();
}//end removeFromCart

// clearCart
userSchema.methods.clearCart = function(){
    this.cart = { items:[] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);














// 'use strict'
// const Model = require('./Model');
// const mongodb = require('mongodb');
// const getDb = require('../../database/database').getDb;
// const slugify = require('slugify')

// class User extends Model{

//     constructor(email, password, cart, _id){
//         super();//alowing Model methods inside this model
//         this.email        = email;
//         this.password = password;
//         this.cart = cart; // {items: []}
//         this._id = new mongodb.ObjectId(_id);
//     }


//     addToCart(product){
//         const cartProductIndex = this.cart.items.findIndex( cp => {
//             return cp.product_id.toString() === product._id.toString();
//         });

//         let newQty = 1;
//         const updatedCartItems = [...this.cart.items];

//         // if product already exists in the cart..
//         if(cartProductIndex >= 0){
//             newQty = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQty;
//         }else{
//             updatedCartItems.push({
//                 product_id: new mongodb.ObjectId(product._id),
//                 quantity: newQty
//                 });
//         }
//         const updatedCart = { 
//             items: updatedCartItems,
//         };
//         const db = getDb();
//         return db
//             .collection('users')
//             .updateOne(
//                 { _id: this._id },
//                 { $set: {cart: updatedCart} }
//                 );
//     }//end addd to cart


//     getCart(){
//         const db = getDb();
//         const product_ids = this.cart.items.map( i => i.product_id);
//         return db
//         .collection('products')
//         .find({_id: {$in: product_ids}})
//         .toArray()
//         .then( products => {
//             return products.map( p => {
//                 return {
//                     ...p,
//                     quantity: this.cart.items.find( i => i.product_id.toString() === p._id.toString()).quantity,
//                 }
//             });
//         }).catch((err) => {
            
//         });
//     }



//     deleteItemFromCart(product_id){
//         const updatedCartItems = this.cart.items.filter(item => item.product_id.toString() !== product_id.toString());
//         const db = getDb();
//         return db
//             .collection('users')
//             .updateOne(
//                 { _id: this._id },
//                 { $set: {cart: {items: updatedCartItems}} }
//                 );
//     }
 

//     addOrder(){
//         const db = getDb();
//         return db
//         .collection('orders')
//         .insertOne(this.cart)
//         .then((result) => {
//             this.cart = {items: []};
//             return db
//             .collection('users')
//             .updateOne(
//                 { _id: this._id },
//                 { $set: { cart: {items: []} } }
//                 );
//         }).catch((err) => {
            
//         });

//     }

// }
// module.exports = User;