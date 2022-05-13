const { model, Schema, ObjectId } = require("mongoose")

const Item = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    accessLink: {type: String},
    date: {type: Date, default: Date.now()},
    path: {type: String, default: ""},
    user: {type: ObjectId, ref: "User"},
    parent: {type: ObjectId, ref: "Item"},
    childs: [{type: ObjectId, ref: "Item"}]
})

module.exports = model("Item", Item)