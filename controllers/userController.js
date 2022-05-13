
const User = require('../models/User')

class UserController {

    async getUsers(req, res) {
        try {

            const usersAll = await User.find()
            console.log(usersAll + "qwerqerw")
            return res.json(usersAll)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "cannot get items"})
        }
    }

    async deleteUser(req, res) {
        try {
            const user = await User.findOne({_id: req.query.id})
            console.log("sdfghjdsjfhgdsfjhg")
            if (!user) {
                return res.status(400).json({message: "User not found"})
            }
            /*itemService.delete*/
            await user.remove()
            return res.json({message: "Item was deleted"})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Collection is not empty"})
        }
    }
}

module.exports = new UserController()