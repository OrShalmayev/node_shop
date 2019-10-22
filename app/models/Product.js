// 'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({

    name: 
    {
        type: String,
        required: true
    },
    description: 
    {
        type: String,
        required: true
    },
    price: 
    {
        type: Number,
        required: true
    },
    inStock: 
    {
        type: Number,
    },
    image: 
    {
        type: String,
    },
    path:
    {
        type: String,
    },
    slug: 
    {
        type: String
    },
    category_slug: 
    {
        type: String,
        required: true
    },


});



productSchema.methods.urlPath = function productPath(){
    return `${process.env.BASE_URL}${process.env.PORT}/${this.category_slug}/${this.slug}`
}
module.exports = mongoose.model('Product', productSchema )