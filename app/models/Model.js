// const mongodb = require('mongodb');
// const getDb = require('../../database/database').getDb;

// module.exports = class Model {

//     // Save product in the database
//     save(collection) {
//         const db = getDb();
//         return db
//         .collection(collection)
//         .insertOne(this)
//         .then((result) => {
//             console.log(result);
//         })
//         .catch((err) => {
//             console.error(err);
//         });
//     }// End Save

//     // Save product in the database
//     update(collection) {
//         const db = getDb();
//         return db
//         .collection(collection)
//         .updateOne({_id: this._id}, {$set: this})
//         .then((result) => {
//             console.log(result);
//         })
//         .catch((err) => {
//             console.error(err);
//         });
//     }// End update


//     // Fetch all Products
//     static fetchAll(collection){
//         const db = getDb();
//         return db
//         .collection(collection)
//         .find()
//         .toArray()
//         .then( collections => { console.dir(collections); /*/*/ return collections; } )
//         .catch(err => console.error(err));
//     }// End fetchAll

//     // fetch single Product
//     static findById(id, collection) {
//         const db = getDb();
//         return db
//         .collection(collection)
//         .find({_id: new mongodb.ObjectID(id)})
//         .next()
//         .then( (product) => {
//             console.dir( product );
//             return product;
//         }).catch((err) => {
//             console.error( new Error('Error: ',err) );
//         });
//     }// End findById


//     static findBySlug(slug, collection){
//         const db = getDb();
//         return db
//         .collection(collection)
//         .find({slug: slug})
//         .next()
//         .then( (product) => {
//             console.dir( product );
//             return product;
//         }).catch((err) => {
//             console.error( new Error('Error: ',err) );
//         });
//     }


//     static findCol(collection, id){
//         const db = getDb();
//         return db
//         .collection(collection)
//         .find({category_id: id})
//         .toArray()
//         .then((products) => {
//             console.dir(products);
//             return products;
//         }).catch((err) => {
//             console.error( new Error('Error: ',err) );
//         });
//     }//end findCol



//     static delete(id, collection)
//     {
//         const db = getDb();
//         return db.collection(collection)
//         .deleteOne({_id: mongodb.ObjectId(id)})
//         .then(() => {
//             console.log('deleted');
//         }).catch((err) => {
//             console.error( new Error('Error: ',err) );
//         });
//     }// End delete

// }//end Model