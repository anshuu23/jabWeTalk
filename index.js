const express = require("express")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const staticRouter = require("./routes/staticRouter")
const userRouter = require("./routes/userRouter")
const mainRouter = require("./routes/mainRouter")
const roomRouter = require("./routes/roomRouter")
const createRoomRouter = require("./routes/createRoomRouter")
const randomChatRouter = require("./routes/randomChatRouter")
const staticCreateRoomRouter = require("./routes/staticCreateRoomRouter")
const {initializeSocket} = require("./services/webSocketService")

const http = require("http")
const { checkAuth, restrictTo } = require("./middlewares/auth")
const server = http.createServer(app)

const io = initializeSocket(server)

app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(checkAuth)

//mongo db connection
mongoose.connect(process.env.MONGODBURL).then(() => console.log("connected to mongodb"))



app.set("view engine", "ejs")
app.set("views", "views")

app.use("/user", userRouter)
app.use("/main", mainRouter)
app.use("/room", restrictTo(["standard"]), roomRouter)
app.use("/randomChat", restrictTo(["standard"]), randomChatRouter)
app.use('/handelCreateRoom',restrictTo(["standard"]), createRoomRouter)
app.use('/createRoom', staticCreateRoomRouter)
app.use('/', staticRouter)



const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})