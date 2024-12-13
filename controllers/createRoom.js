const roomModel = require("../models/room")

function handelCreateRoom(req,res){
    const {roomName , roomTags, roomDescription, privacy} = req.body
    
    const roomAdmin = req.user.id
    let tagsArray = roomTags.split(",")
    tagsArray = tagsArray.map(tag => tag.trim());
    roomModel.create({
        roomName , tagsArray , roomDescription , privacy,roomAdmin
    })
    .then((data)=>{
        console.log(data)
    })
    .catch((err)=>{
        console.log(err)
    })
    
   }

module.exports = {handelCreateRoom}