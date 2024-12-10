const express= require("express")
const router=express.Router()
const {handelUserAccountCreateion,handelUserLogin} = require("../controllers/user")

router.post("/createAccount" , handelUserAccountCreateion)
router.post("/login" , handelUserLogin)

module.exports=router