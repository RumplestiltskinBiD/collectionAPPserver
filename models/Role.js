const {Schema, model, ObjectId} = require('mongoose')


const Role = new Schema({
    value: {type: String, unique: true, default: "USER"},
    /*user: {type: ObjectId, ref: "User"}*/
})

module.exports = model('Role', Role)