const User = require('../app/models/User');
// middleware for making the user stayed logged in untill he clicks logout.
module.exports = (req, res, next) => {

    User.findById(req.session.user_id)
    .then((user) => {
        if(!user){
            return next();
        }
        req.user = user;
        next();//allowing the nexxt function to work
    }).catch((err) => {
        next(new Error(err));
    });
}