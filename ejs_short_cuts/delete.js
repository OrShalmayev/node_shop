module.exports = (req, res, next) => {
    global.DELETE = `<input type="hidden" name="_method" value="DELETE">`;
    next();
}