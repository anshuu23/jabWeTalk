const socket = io()
const container = document.querySelectorAll(".peopleOnline")   
console.log(container[0])
container.forEach((room)=>{
    socket.emit("HowManyUsersInRoom" , room.id)
})

socket.on("thisManyUsersInRoom" , (data)=>{
    container.forEach((room)=>{
        if(room.id == data.room){
            room.innerHTML = data.usersInRoom
        }
    })
    
})