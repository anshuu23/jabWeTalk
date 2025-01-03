const jwt = require("jsonwebtoken")
const secretKey = process.env.TOKENKEY
function setUser(user){
   const token = jwt.sign({
    email:user.email,
    name:user.name,
    userRole:user.userRole,
    id:user._id
   },secretKey)
   
   return token
}

function getUser(token){
    try{
        const user = jwt.verify(token , secretKey)
        return user
    }
    catch(err){
        return null;
    }

}
module.exports ={setUser,getUser}