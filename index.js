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
app.use('/handelCreateRoom', createRoomRouter)

let map = new Map()
let countUserInRoom = new Map()
let counter = 1;
io.on("connection", (socket) => {

    socket.on("joined-room", (data) => {
        const { room, user } = data
        socket.join(room)
        map.set(socket.id, { room, user })
        
        socket.to(room).emit("newUserJoinedMessage", user.name)
        if(!countUserInRoom.has(room)) {
            countUserInRoom.set(room , 1)
        }
        else
        {
            const currentCount = countUserInRoom.get(room);
            counter = currentCount + 1;
            countUserInRoom.set(room ,counter)
        }
        
        
    })

    socket.on("HowManyUsersInRoom" , (room)=>{
        
        let usersInRoom = countUserInRoom.get(room);
        if(!usersInRoom) usersInRoom = 0
       
        socket.emit("thisManyUsersInRoom" , {room,usersInRoom})
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
            countUserInRoom.set(room , counter--)

            const currentCount = countUserInRoom.get(room);
            counter = currentCount - 1;
            countUserInRoom.set(room ,counter)




        }
    })

})

const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})