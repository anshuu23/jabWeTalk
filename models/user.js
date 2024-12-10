
const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,

    },
    name:{
        type:String,
        required:true,

    },
    userRole:{
        type:String,
        require:true,
        default:"standard"
    }
}, {timestamps:true})

const user = mongoose.model("user" , userSchema)

module.exports = user
    