const Router = require('express')
const router = new Router()
const authMiddleware = require("../middleware/auth.middleware")
const itemController = require("../controllers/itemController")


router.post('', authMiddleware, itemController.createCollection)
router.post('/upload', authMiddleware, itemController.uploadFile)
router.get('', authMiddleware, itemController.getItems)
router.get('', itemController.getItemsAll)
router.get('/search', itemController.searchItem)
router.delete('', authMiddleware, itemController.deleteItem)





module.exports = router