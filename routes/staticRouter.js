const express= require("express")
const router=express.Router()

router.get("/createAccount" , (req,res)=>{
    let err = req.query.error;
    
    res.render("index" ,{err})
})

router.get("/login" , (req,res)=>{
    let err = req.query.error;
    if(!err) err = null
    res.render("login" , {err})
})



router.get("/about" , (req,res)=>{
    res.render("about")
})



const {handelMainPage} = require("../controllers/main")
router.get("/" ,handelMainPage)
module.exports=router