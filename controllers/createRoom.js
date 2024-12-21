const roomModel = require("../models/room")

function handelCreateRoom(req,res){
    let {roomName , roomTags, roomDescription, privacy} = req.body
    if(!roomName || !roomTags || !roomDescription || !privacy) return res.status(400).send({msg:"pls send all details"})
    roomName = roomName.trim()
    const roomAdmin = req.user.id
    let tagsArray = roomTags.split(",")

    tags = tagsArray
    .filter(tag => tag.trim() !== '')
    .map(tag => ({ tagName: tag.trim() }));
   
       
    roomModel.create({
        roomName , tags , roomDescription , privacy,roomAdmin
    })
    .then((data)=>{
        console.log("this data is saved in db" , data)

        return res.redirect("/main")
    })
    .catch((err)=>{
        console.log(err)
    })
    
   }

module.exports = {handelCreateRoom}