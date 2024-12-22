const express= require("express")
const router=express.Router()
router.get("/" , (req,res)=>{
    res.render("randomChat" , {user:req.user})
})


module.exports=router