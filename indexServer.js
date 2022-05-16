const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const fileUpload = require("express-fileupload")
const authRouter = require("./routes/auth.routes")
const itemRouter = require("./routes/item.routes")
const userRouter = require("./routes/user.routes")
const app = express()
const PORT = process.env.PORT || config.get('serverPort')
const corsMiddleware = require('./middleware/cors.middleware')
const itemPathMiddleware = require('./middleware/itempath.middleware')
const path = require("path")

app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(itemPathMiddleware(path.resolve(__dirname, 'Items')))
app.use(express.json())
app.use("/api/auth", authRouter)
app.use("/api/items", itemRouter)
app.use("/api/users", userRouter)

const start = async () => {
    try {
        mongoose.connect(config.get('dbUrl'))
        app.listen(PORT, () => {
            console.log(PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

start()