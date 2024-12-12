const express = require("express")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const staticRouter = require("./routes/staticRouter")
const userRouter = require("./routes/userRouter")
const mainRouter = require("./routes/mainRouter")
const roomRouter = require("./routes/roomRouter")
const { Server } = require("socket.io")
const http = require("http")
const { checkAuth, restrictTo } = require("./middlewares/auth")
const server = http.createServer(app)
const io = new Server(server);

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
app.use('/', staticRouter)

let map = new Map()
io.on("connection", (socket) => {

    socket.on("joined-room", (data) => {
        const { room, user } = data
        socket.join(room)
        map.set(socket.id, { room, user })
        console.log("username = " + user)
        socket.to(room).emit("newUserJoinedMessage", user.name)
    })

    socket.on("send-message", ({ room, message }) => {
        const obj = map.get(socket.id);
        const userName = obj.user.name
       
        socket.broadcast.to(room).emit("userMessage", { userName, message })
    })

    socket.on("someoneIsTyping" , (room)=>{
        const obj = map.get(socket.id);
        const userName = obj.user.name
        socket.broadcast.to(room).emit("someoneIsTyping" , userName)
    })
    socket.on("stoppedTyping" , (room)=>{
        const obj = map.get(socket.id);
        const userName = obj.user.name
        socket.broadcast.to(room).emit("stoppedTyping" , userName)
        console.log("stopped typing")
    })

    socket.on("disconnect", () => {
        const userData = map.get(socket.id);

        if (userData) {
            const { room, user } = userData
            socket.to(room).emit("userDisconnected", user.name)
            map.delete(socket.id)

        }
    })

})

const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})