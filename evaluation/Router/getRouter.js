const express = require("express");
const {authMiddleware} = require("../middleware/auth")

const getRouter = express.Router();


getRouter.get("/",authMiddleware,async (req,res)=>{
    try{
        res.send("create")

    }catch(err){
        res.send(err.message);

    }

})

module.exports = {
    getRouter
}