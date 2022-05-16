const itemService = require('../services/itemService')
const fs = require('fs')
const User = require('../models/User')
const Item = require('../models/Item')

class ItemController {
    async createCollection(req, res) {
        try {
            const {name, type, parent, childs} = req.body
            const item = new Item({name, type, parent, childs, user: req.user.id})
            const parentItem = await Item.findOne({_id: parent})
            if(!parentItem) {
                item.path = name
                await itemService.createCollection(req, item)
            } else {
                item.path = `${parentItem.path}\\${item.name}`
                await itemService.createCollection(req, item)
                parentItem.childs.push(item._id)
                await parentItem.save()
            }
            await item.save()
            return res.json(item)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async getItems(req, res) {
        try {
            const items = await Item.find({user: req.user.id, parent: req.query.parent})
            return res.json(items)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "cannot get items"})
        }
    }

    async getItemsAll(req, res) {
        try {
            const itemsAll = await Item.find({parent: req.query.parent})
            return res.json(itemsAll)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "cannot get items"})
        }
    }

    async uploadFile(req, res) {
        try {
            const item = req.files.item
            const parent = await Item.findOne({user: req.user.id, _id: req.body.parent})
            const user = await User.findOne({_id: req.user.id})
            let path;
            if(parent) {
                path = `${req.itemPath}\\${user._id}\\${parent.path}\\${item.name}`
            } else {
                path = `${req.itemPath}\\${user._id}\\${item.name}`
            }
            if (fs.existsSync(path)) {
                return res.status(400).json({message: 'Item already exist!'})
            }
            item.mv(path)
            const type = item.name.split('.').pop()
            let itemPath = item.name
            if(parent) {
                itemPath = parent.path + "\\" + item.name
            }
            const dbItem = new Item({
                name: item.name,
                type,
                path: itemPath,
                parent: parent ? parent._id : null,
                user: user._id
            })
            parent.childs.push(dbItem._id)
            await dbItem.save()
            await parent.save()
            await user.save()
            res.json(dbItem)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Upload error"})
        }
    }

    async deleteItem(req, res) {
        try {
            const item = await Item.findOne({_id: req.query.id, user: req.user.id})
            if(!item) {
                return res.status(400).json({message: "Item not found!!!"})
            }
            itemService.deleteFile(req, item)
            await item.remove()
            return res.json({message: "Deleted successful"})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Collection is not empty"})
        }
    }

    async searchItem(req, res) {
        try {
            const searchName = req.query.search
            let items = await Item.find()
            items = items.filter(item => item.name.includes(searchName))
            return res.json(items)
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Search error"})
        }
    }
}

module.exports = new ItemController()