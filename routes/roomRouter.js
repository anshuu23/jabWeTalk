const express= require("express")
const router=express.Router()

router.get("/" , (req,res)=>{
    const {room} = req.query
    if(!room){
        return res.redirect("main")
    }

    res.render("room" , {user:req.user , room})
})


module.exports=router