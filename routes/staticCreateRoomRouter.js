const express= require("express")
const router=express.Router()

router.get("/" , (req,res)=>{
    res.render("createRoom")
})
module.exports=router