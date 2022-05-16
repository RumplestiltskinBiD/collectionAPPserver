const Router = require('express')
const router = new Router()
const userController = require("../controllers/userController")
const roleMiddleware = require("../middleware/role.middleware")

router.get('',roleMiddleware(['ADMIN']), userController.getUsers)
router.delete('', roleMiddleware(['ADMIN']), userController.deleteUser)

module.exports = router