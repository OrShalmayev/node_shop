const { check } = require('express-validator');
const Category = require('../app/models/Category');

module.exports =
    [
        // Category
        check('category')
        .custom( value => {
            return Category.find({name: value})
                .then((category) => {
                    if(!category){
                        return Promise.reject('Category not found...');
                    }
                })
        }),
        // Name
        check('name').isLength({min:3}).withMessage('Product name must contain at least 3 chars.'),
        // Price
        check('price')
        .isNumeric().withMessage('only digits allowed')
        .isFloat(),
        // Description
        check('description').isLength({min:10}).withMessage('Category Description must contain at least 10 chars.')
    ];

