const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
    products: [{
        product_data: { type:Object, required: true},
        quantity: { type:Number, required:true}
    }],
    user: {
        email: {
            type: String,
            required: true
        },
        user_id: {
            type: Schema.Types.ObjectId,
            required:true,
            ref: 'User'
        },
    },
});

module.exports = mongoose.model('Order', orderSchema);

























// 'use strict'
// const Model = require('./Model');
// const mongodb = require('mongodb');
// const getDb = require('../../database/database').getDb;
// const slugify = require('slugify')

// class Order extends Model{

//     constructor(fullname, address, products, total, _id){
//         super();//alowing Model methods inside this model
//         this.fullname = fullname;
//         this.address = address;
//         this.products = products;
//         this.total = total;
//         this._id         = new mongodb.ObjectId(_id);
//     }


// }
// module.exports = Order;