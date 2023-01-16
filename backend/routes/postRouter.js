const express = require("express");
const jwt = require("jsonwebtoken");
const { PostModel } = require("../models/post.model");
require("dotenv").config();

const postRouter = express.Router();

postRouter.use(express.json());

postRouter.get('/', async (ask,give)=>{
    let token=ask.headers.authorization;
    let decoded=jwt.verify(token,process.env.secret);
    let loginuserid=decoded._id;
    if(ask.query.device||ask.query.device1||ask.query.device2){
        if(ask.query.device){
            let posts= await PostModel.find({"device":ask.query.device,userid:loginuserid});
            give.send(posts);
        }else{
            let posts= await PostModel.find({$or:[{"device":ask.query.device1},{"device":ask.query.device2}],userid:loginuserid});
            give.send(posts);
        }
    }else{
        let posts= await PostModel.find({userid:loginuserid});
        give.send(posts);
    }
    
    
})

postRouter.post('/create', async(ask,give)=>{
    let token=ask.headers.authorization;
    let decoded=jwt.verify(token,process.env.secret);
    ask.body.userid=decoded._id;
    let userpost= new PostModel(ask.body);
    try {
        userpost.save();
    give.send({ "msg": "Your Post has been created" })
    } catch (error) {
        console.log(error);
        give.send({ "msg": "Something went wrong while creating post." })
    }
    
})

postRouter.patch('/update/:id', async(ask,give)=>{
    try {
    await PostModel.findByIdAndUpdate(ask.params.id,ask.body);
    give.send({ "msg": `Post with Id ${ask.params.id} has been updated.` });
    } catch (error) {
        console.log(error);
        give.send({ "msg": "Something went wrong while updating the post." })
    }
    
})

postRouter.delete('/delete/:id', async(ask,give)=>{
    try {
    await PostModel.findByIdAndDelete(ask.params.id);
    give.send({ "msg": `Post with Id ${ask.params.id} has been deleted.` });
    } catch (error) {
        console.log(error);
        give.send({ "msg": "Something went wrong while deleting the post." })
    }
    
})

module.exports={
    postRouter
}