module.exports = (req, res , next) => {
    if(typeof req.session.isLoggedIn != 'undefined'){
        global.user = {
            isAuthenticated: true,
            username: req.session.username,
        };
    }else{
        global.user = {
            isAuthenticated: false,
        }
    }

    // check if user is admin
    if(req.session.isAdmin){
        global.user.isAdmin = true;
    }else{
        global.user.isAdmin = false;
    }

    next();
}