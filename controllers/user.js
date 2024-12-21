const user = require("../models/user")
const {setUser} = require("../services/auth") 

function handelUserAccountCreateion(req,res){
    const {email,password,name} = req.body;
    if(!email || !password || !name) return  res.redirect("/")
    user.create({email,password,name})
    .then(()=>{
        res.redirect("/login")
    })
    .catch((err)=>{
        res.redirect("/?error=email alreay exist")
    })
}

function handelUserLogin(req,res){
    const {email,password} = req.body;
    if(!email || !password ) return res.redirect("/login")
    
    user.findOne({
        email,password
    })
    .then((data)=>{
        if(!data) return res.redirect("/login")
       
        const token = setUser(data)
        res.cookie("jwt" , token)
        return res.redirect("/main")
    })
}

module.exports = {handelUserAccountCreateion ,handelUserLogin}