module.exports = ((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...)
    // res.redirect('/500');
    console.error(new Error(error));
    res.status(500).render('500', {layout: '500'})
});