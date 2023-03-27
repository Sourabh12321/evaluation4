const jwt = require("jsonwebtoken");

require("dotenv").config();
const {userModel} = require("../models/userModel");
const {redisClient} = require("../config/redis");

const authMiddleware = async (req,res,next)=>{
    try{
        let cookieEmail = req.cookies.email;
        let token = JSON.parse(await redisClient.GET(cookieEmail));
        let block = await redisClient.HGET("blocked",cookieEmail);
        if(block==token.token){
            return res.send("please login again")
        }
        const decoded_token = jwt.verify(token.token,"masai", async (err,decoded)=>{
            if(err){
                res.send("login again")
            }else{
                next();
            }
        });

    }catch(err){

    }
}


module.exports = {
    authMiddleware
}