const mongoose =require("mongoose")
const roomSchema = new mongoose.Schema({
    roomAdmin:{
        type:String,
        required:true,
    },
    roomName:{
        type:String,
        required:true,
        unique:true
    },
    roomDescription:{
        type:String,      
    },
    privacy:{
        type:String,
        default:"public",
    },
    tags:[
        {
            tagName:{
                type:String
            }
        }
    ]
})

const roomModel = mongoose.model("roomModel" , roomSchema)
module.exports = roomModel