const Router = require("express");
const User = require("../models/User")
const Role = require("../models/Role")
const bcrypt = require("bcrypt")
const config = require("config")
const jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")
const router = new Router()
const authMiddleware = require("../middleware/auth.middleware")
const itemService = require('../services/itemService')
const Item = require('../models/Item')

router.post("/registration",
    [
        check("email", "Incorrect email").isEmail(),
        check("password", "Incorrect password").isLength({min: 3, max: 30})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: "Incorrect request", errors})
        }
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if(candidate) {
            return res.status(400).json({message: `${email} already exist`})
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const userRole = await Role.findOne({value: "USER"})
        const user = new User({email, password: hashPassword, roles: [userRole.value]})
        await user.save()
        await itemService.createCollection(req, new Item({user: user.id, name: ''}))
        return res.json({message: `User was created`})
    } catch (e) {
        res.send({message: "Error ", e})
    }
})

router.post("/login",
    async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                return res.status(404).json({message: "User not found"})
            }
            const isPassValid = bcrypt.compareSync(password, user.password)
            if (!isPassValid) {
                return res.status(400).json({message: "Invalid password"})
            }
            const token = jwt.sign({id: user.id, roles: user.roles}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    collections: user.collections,
                    role: user.roles
                }
            })
        } catch (e) {
            res.send({message: "Error ", e})
        }
    })

router.get("/auth", authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user.id})
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    collections: user.collections
                }
            })
        } catch (e) {
            res.send({message: "Error ", e})
        }
    })

router.get("/adminpage",
    async (req, res) => {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e + " wtf")
        }
    }
)

router.get("/allitems",
    async (req, res) => {
        try {
            const itemsAndCollections = await Item.find()
            res.json(itemsAndCollections)
        } catch (e) {
            console.log(e)
        }
    }
)

module.exports = router