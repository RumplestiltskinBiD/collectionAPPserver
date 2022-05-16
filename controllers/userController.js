const User = require('../models/User')

class UserController {

    async getUsers(req, res) {
        try {
            const usersAll = await User.find()
            return res.json(usersAll)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "cannot get items"})
        }
    }

    async deleteUser(req, res) {
        try {
            const user = await User.findOne({_id: req.query.id})
            if (!user) {
                return res.status(400).json({message: "User not found"})
            }
            await user.remove()
            return res.json({message: "User was deleted"})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Collection is not empty"})
        }
    }
}

module.exports = new UserController()