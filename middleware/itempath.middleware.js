function itemPath(path) {
    return function (req, res, next) {
        req.itemPath = path
        next()
    }
}

module.exports = itemPath