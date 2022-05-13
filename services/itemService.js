const fs = require('fs')
const Item = require('../models/Item')
const config = require('config')

class ItemService {
    createCollection(item) {
        const itemPath = `${config.get('itemPath')}\\${item.user}\\${item.path}`
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

    deleteFile(item) {
        const path = this.getPath(item)
        if(item.type === "collection") {
            fs.rmdirSync(path)
        } else {
            fs.unlinkSync(path)
        }
    }

    getPath(item) {
        return config.get("itemPath") + '\\' + item.user + '\\' + item.path;
    }
}


module.exports = new ItemService()