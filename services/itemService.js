const fs = require('fs')
const Item = require('../models/Item')
const config = require('config')

class ItemService {
    createCollection(req, item) {
        const itemPath = this.getPath(req, item)
        return new Promise((resolve, reject) => {
            try {
                if(!fs.existsSync(itemPath)) {
                    fs.mkdirSync(itemPath)
                    return resolve({message: "Item was created"})
                } else {
                    return reject({message: "Item already exist"})
                }
            } catch (e) {
                return reject({message: "Item error"})
            }
        })
    }

    deleteFile(req, item) {
        const path = this.getPath(req, item)
        if(item.type === "collection") {
            fs.rmdirSync(path)
        } else {
            fs.unlinkSync(path)
        }
    }

    getPath(req, item) {
        return req.itemPath + '\\' + item.user + '\\' + item.path;
    }
}


module.exports = new ItemService()