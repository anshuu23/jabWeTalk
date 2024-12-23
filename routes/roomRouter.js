const express= require("express")
const router=express.Router()
const {handelRoomRequest , handelFindRoomRequest} = require("../controllers/room")

router.post("/findRoom" , handelFindRoomRequest)

router.get("/" , handelRoomRequest)


module.exports=router