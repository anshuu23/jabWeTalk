const express= require("express")
const router=express.Router()
const {messageMap} = require("../services/webSocketService")

router.get("/" , (req,res)=>{
    const {room} = req.query
    if(!room){
        return res.redirect("main")
    }

    let messages = messageMap.get(room) || [];
    
    console.log("this  is user 89" , req.user)
    
    res.render("room" , {user:req.user , room , messages })
})


module.exports=router