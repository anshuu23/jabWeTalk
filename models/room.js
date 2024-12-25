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
    ],
    messages:[
        {
            userName:{
                type:String,
            },
            message:{
                type:String,
            },
            messageId:{
                type:String,
            },
            userId:{
                type:String,
            },
            time:{
                type:String,
            },
            date:{
                type:String,
                default:null,
            }
        }
    ]
})

const roomModel = mongoose.model("roomModel" , roomSchema)
module.exports = roomModel