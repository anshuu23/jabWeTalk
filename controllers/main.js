const roomModel = require("../models/room")
function handelMainPage(req,res){
    roomModel.find({})
    .then((data)=>{
        
    res.render("main",{data})

    })
    .catch((err)=>{
        console.log(err)
    })

}

module.exports ={handelMainPage}