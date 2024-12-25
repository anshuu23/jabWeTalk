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
   async function handelFindRoomRequest(req,res){
        let {roomName }  = req.body
        if(!roomName) return res.send({msg:'pls send room name'})
        let page = Number(req.query.page)
        if(!page) page = 1;
        const limit = 1;
        console.log(page)
        roomName = roomName.trim()
        
       let data = await roomModel.find({
            $or: [
                { roomName : { $regex: `^${roomName}$`, $options: 'i' }}, 
                { 'tags.tagName': { $regex: `^${roomName}$`, $options: 'i' } }
            ]
        })
        .skip((page - 1) * limit)
        .limit(limit)

        const totalRooms = await roomModel.countDocuments({
            $or: [
                { roomName: roomName }, 
                { 'tags.tagName': { $regex: `^${roomName}$`, $options: 'i' } }
            ]
        });

        const totalPages = Math.ceil(totalRooms/limit);

        return res.render("findRoom" , {data , page , roomName , totalPages})
        }

module.exports = {handelRoomRequest , handelFindRoomRequest}