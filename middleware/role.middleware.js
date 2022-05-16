const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            return next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(401).json({message: 'Auth error no token'})
            }
            const {roles: userRoles} = jwt.verify(token, config.get('secretKey'))
            let hasRole = false
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                }
            })
            if(!hasRole) {
                    return res.status(403).json({message: 'You have not access!'})
            }
            next()
        } catch (e) {
            console.log(e)
            return res.status(401).json({message: 'Auth error role.middleware'})
        }
    }
}