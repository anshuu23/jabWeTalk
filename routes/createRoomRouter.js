const express= require("express")
const router=express.Router()
const {handelCreateRoom} = require("../controllers/createRoom")

router.post("/" , handelCreateRoom)


module.exports=router