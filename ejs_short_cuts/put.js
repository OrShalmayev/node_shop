
module.exports = (req, res, next) => {
    global.PUT = `<input type="hidden" name="_method" value="PUT">`;
    next();
}
