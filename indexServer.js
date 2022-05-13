const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const fileUpload = require("express-fileupload") //check
const authRouter = require("./routes/auth.routes")
const itemRouter = require("./routes/item.routes")
const userRouter = require("./routes/user.routes")


const app = express()
const PORT = config.get('serverPort')
const corsMiddleware = require('./middleware/cors.middleware')

app.use(fileUpload({})) //check
app.use(corsMiddleware)
app.use(express.json())
app.use("/api/auth", authRouter)
app.use("/api/items", itemRouter)
app.use("/api/users", userRouter)
/*app.use("/api/auth/adminpage", authRouter)*/







const start = async () => {
    try {
        mongoose.connect(config.get('dbUrl'))

        app.listen(PORT, () => {
            console.log(PORT)
        })
    } catch (e) {
        
    }
}

start()