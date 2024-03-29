const jwt=require("jsonwebtoken");
require("dotenv").config();

const authenticate=(ask,give,next)=>{
    let token=ask.headers.authorization;
    jwt.verify(token,process.env.secret,async (err,decoded)=>{
        if(err){
            give.send({ "msg": "Please Login" })
        }else{
            next();
        }
    }) 
}

module.exports={
    authenticate
}