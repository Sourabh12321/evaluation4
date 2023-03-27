const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {redisClient} = require("../config/redis")
const {userModel} = require("../models/userModel");
const {authMiddleware} = require("../middleware/auth")

const postRoute = express.Router();


postRoute.post("/signup",async (req,res)=>{
    const {name,email,password} = req.body;
    try{
        let data = await userModel.find({"email":email});
        if(data.length>0){
            res.send("user is already register")
        }else{
            bcrypt.hash(password,5 , async (err,hash)=>{
                if(err){
                    res.send(err.message);
                }else{
                    const user = new userModel({name,email,password:hash});
                    await user.save();
                    res.send("user is created");
                }
            })

        }

    }catch(err){
        res.send(err.message);
    }
})


postRoute.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    try{
        let data = await userModel.find({"email":email});
        console.log(data)
        if(data.length>0){
            bcrypt.compare(password,data[0].password, async (err,result)=>{
                if(err){
                    res.status(401).json(err.message);
                }else{
                    let token = jwt.sign({userid:data[0].id},"masai",{expiresIn:600});
                    res.cookie("email",`${data[0].email}`);
                    let obj = {
                        token
                    }
                    await redisClient.SET(data[0].email, JSON.stringify(obj));

                    res.send({"token":token});
                }
            })
            
        }else{
            res.send("user is not register")
        }


    }catch(err){
        res.send(err.message);
    }
})

postRoute.post("/logout",async (req,res)=>{
    try{
        const payload = req.cookies.email;
        console.log(payload);
        const blacklist_token = JSON.parse(await redisClient.GET(payload));
        console.log(blacklist_token);

        await redisClient.HSET("blocked",payload,blacklist_token.token);
        res.send("logout successfull");
        

    }catch(err){
        res.send(err.message);
    }
})


module.exports = {
    postRoute
}