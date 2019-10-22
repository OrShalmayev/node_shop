const { check } = require('express-validator');
const User = require('../app/models/User');

module.exports = [
    // Username
    check('username')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 chars long.')
    .trim(),

    // Email
    check('email')
    .isEmail().withMessage('Please provide a valid email.')
    .normalizeEmail()
    .custom((value, { req } )=> {
        return User.findOne({email:value})
                    .then(user => {
                        if (user) {
                            return Promise.reject('E-mail already in use');
                        }
                    })
      })
      .trim(),

    // Password
    check('password')
    .custom((value, { req }) => {
        if (value !== req.body.confirm_password) {
          throw new Error('Password confirmation is incorrect');
        }
        return true;
      })
    .isLength({ min: 8 }).withMessage('Password must be at least 8 chars long')
    .isAlphanumeric()
    .matches(/\d/).withMessage('Password must contain a number')
    .trim(),

    // Confirm Password
];