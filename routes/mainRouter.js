const express= require("express")
const router=express.Router()
const {handelMainPage} = require("../controllers/main")

router.get("/" ,handelMainPage)

module.exports=router