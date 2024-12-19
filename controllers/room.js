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

module.exports = {handelRoomRequest}