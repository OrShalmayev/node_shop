const { check } = require('express-validator');


module.exports =
    [
        // Name
        check('name').isLength({min:3}).withMessage('Category name must contain at least 3 chars.'),
        // Image

        // Description
        check('description').isLength({min:10}).withMessage('Category Description must contain at least 10 chars.')
    ];

