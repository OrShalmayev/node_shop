const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify')


const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    slug: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Category', categorySchema);
// 'use strict'
// const Model = require('./Model');
// const mongodb = require('mongodb');
// const getDb = require('../../database/database').getDb;

// class Category extends Model{

//     constructor(name, description, image, slug, _id){
//         super();//alowing Model methods inside this model
//         this.name        = name;
//         this.description = description;
//         this.image       = image;
//         this.slug        = slug;
//         this._id         = new mongodb.ObjectId(_id);
//     }


// }
// module.exports = Category;