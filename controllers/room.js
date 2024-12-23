const { response } = require("express")
const roomModel = require("../models/room")
const {messageMap} = require("../services/webSocketService")
function handelRoomRequest(req,res){
    
        const {room} = req.query
        if(!room){
            return res.redirect("main")
        }
        
        roomModel.findOne({roomName:room})
        .then((data)=>{
            console.log("this is data" ,data)
            if(data == null){
            return res.status(500).json({msg:"room dosent exist"})
            }
            let messages = messageMap.get(room) || [];
        return res.render("room" , {user:req.user , room , messages })
        })

        
    }
    function handelFindRoomRequest(req,res){
        let {roomName , page}  = req.body
        if(!page) page = 1;
        const limit = 3;
        console.log(page)
        roomName = roomName.trim()
        roomModel.find({
            $or: [
                { roomName : { $regex: `^${roomName}$`, $options: 'i' }}, 
                { 'tags.tagName': { $regex: `^${roomName}$`, $options: 'i' } }
            ]
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .then((data)=>{
          return  res.render("findRoom",{data , page , roomName})
        })
        
    }

module.exports = {handelRoomRequest , handelFindRoomRequest}