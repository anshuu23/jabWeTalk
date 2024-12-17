const express= require("express")
const router=express.Router()
const {messageMap} = require("../services/webSocketService")

router.get("/" , (req,res)=>{
    const {room} = req.query
    if(!room){
        return res.redirect("main")
    }

    const messages = messageMap.get(room) || [];
    res.render("room" , {user:req.user , room , messages })
})


module.exports=router