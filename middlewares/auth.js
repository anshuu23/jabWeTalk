const {getUser} = require("../services/auth")

function checkAuth(req,res,next){
    const token = req.cookies.jwt;
    if(!token){
        req.user = null;
    }
    const user = getUser(token)
    if(!user){
        req.user = null;
    }

   
    req.user = user;
    next()
}

function restrictTo(roles = []){
    return function (req,res,next){
        if(!req.user){
            return res.redirect("/createAccount")
        }
        
        const userRole = req.user.userRole;
        if(!roles.includes(userRole)){
            
            res.redirect("/")
        }
        next()
    }
}

module.exports = {checkAuth,restrictTo}