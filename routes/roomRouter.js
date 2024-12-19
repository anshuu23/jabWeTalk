const express= require("express")
const router=express.Router()
const {handelRoomRequest} = require("../controllers/room")

router.get("/" , handelRoomRequest)


module.exports=router