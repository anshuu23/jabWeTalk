const express= require("express")
const router=express.Router()

router.get("/createAccount" , (req,res)=>{
    let err = req.query.error;
    
    res.render("index" ,{err})
})

router.get("/login" , (req,res)=>{
    res.render("login")
})

router.get("/createRoom" , (req,res)=>{
    res.render("createRoom")
})



const {handelMainPage} = require("../controllers/main")
router.get("/" ,handelMainPage)
module.exports=router