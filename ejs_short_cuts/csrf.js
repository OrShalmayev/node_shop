module.exports = (req, res, next) => {
    csrfToken = req.csrfToken();
    global.CSRF = `<input type="hidden" name="_csrf" value="${csrfToken}">`;
    next();
}