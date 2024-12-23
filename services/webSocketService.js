const {Server} = require("socket.io")
const {saveMessageToDb} =require("./saveMessageToDb")
const messageMap = require("./map")
let map = new Map()
let countUserInRoom = new Map()
let randomChatArray = []
let randomChatMap = new Map()


function scheduleReset() {
    const now = new Date();
    const nextMidnight = new Date();

    // Set the time to 12:00 AM the next day
    nextMidnight.setDate(now.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);

    const timeUntilMidnight = nextMidnight - now;

    setTimeout(() => {
        messageMap.clear();
        console.log("Map has been reset at 12 AM");
        scheduleReset(); // Reschedule for the next day
    }, timeUntilMidnight);
}

scheduleReset();

function initializeSocket(server){
    const io = new Server(server);


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
                let counter = currentCount + 1;
                countUserInRoom.set(room ,counter)
            }
            
            let usersInRoom = countUserInRoom.get(room);
            if(!usersInRoom) usersInRoom = 0
            io.emit("thisManyUsersInRoom" , {room,usersInRoom})
        })

        
    
        socket.on("HowManyUsersInRoom" , (room)=>{
            
            let usersInRoom = countUserInRoom.get(room);
            if(!usersInRoom) usersInRoom = 0
            socket.emit("thisManyUsersInRoom" , {room,usersInRoom})
        })
    
        socket.on("send-message", ({ room, message , messageId , time}) => {
            const obj = map.get(socket.id);
            const userName = obj.user.name 
            const userId = obj.user.id
            
            socket.emit("messageStatus" , messageId )
            socket.broadcast.to(room).emit("userMessage", { userName, message , messageId ,userId , time , messageStatus:false})
            
            const objOfMsg = {userName, message , messageId ,userId , time}
    
            if(messageMap.has(room)){
                const prevMsg =  messageMap.get(room);
                prevMsg.push(objOfMsg)
                messageMap.set(room , prevMsg )
            }
            else{
            messageMap.set(room , [objOfMsg])
            }
            if(messageMap.get(room).length > 200){
                saveMessageToDb(room)
            }
            
        })
    
        socket.on("messageStatusSeen" , ({messageId , room , userId})=>{
            socket.broadcast.to(room).emit("messageStatusSeen" ,messageId , userId);
            let arr = messageMap.get(room)
            arr.forEach(message => {
               if(message.messageId == messageId) {
                message.messageStatus = true
                
            } 
            });
            messageMap.set(room , arr)
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
            
        })
    
        socket.on("disconnect", () => {
            const userData = map.get(socket.id);
            
                if(randomChatArray.includes(socket)){
                    const index = randomChatArray.indexOf(socket); 
                    if (index !== -1) {
                        randomChatArray.splice(index, 1); 
                    }
                }
                if(randomChatMap.has(socket.id)){
                const room =randomChatMap.get(socket.id);
                io.to(room).emit("userLeftChat")
                randomChatMap.delete(socket.id)
                
                }
            
    
            if (userData) {
                const { room, user } = userData
                socket.to(room).emit("userDisconnected", user.name)
                map.delete(socket.id)

    
                const currentCount = countUserInRoom.get(room);
                counter = currentCount - 1;
                countUserInRoom.set(room ,counter)
    
                let usersInRoom = countUserInRoom.get(room);
            if(!usersInRoom) usersInRoom = 0
            io.emit("thisManyUsersInRoom" , {room,usersInRoom})
        }
        })

        socket.on("joined-randomChat" , (user)=>{
        
            if(randomChatArray.length == 0){
                socket.user = user
                randomChatArray.push(socket)
               
                socket.emit("waitingForPerson")
            }
            else{
                const room = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
                socket.join(room);
                const partner = randomChatArray.pop()
                partner.join(room);
                socket.emit("newUserJoinedMessage", {name:partner.user.user.name , roomm:room})
                io.to(partner.id).emit("newUserJoinedMessage", {name:user.user.name , roomm:room})


                randomChatMap.set(partner.id , room)
                randomChatMap.set(socket.id , room)
               
            }
    
            })
            socket.on("sendMessageRandomChat" , ({ room, message ,  time})=>{
                
                socket.broadcast.to(room).emit("recivedMessageRandomChat" ,{message ,time})
            })

            socket.on("someoneIsTypingAtRandomChat" , (room)=>{
                socket.broadcast.to(room).emit("TheyAreTyping")
            })
            
            socket.on("stoppedTypingAtRandomChat" , (room)=>{
                socket.broadcast.to(room).emit("stoppedTyping")
            })

    
    })
    
    return io;
}

module.exports = {initializeSocket , messageMap}