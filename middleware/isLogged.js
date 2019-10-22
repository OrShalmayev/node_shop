module.exports = (req, res, next) => {
    if(typeof req.session.isLoggedIn != 'undefined'){
        return next();
    }
    res.status(401).redirect('/login');
}