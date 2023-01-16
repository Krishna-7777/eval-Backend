const express=require("express");
const cors=require("cors");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/userRouter");
const { postRouter } = require("./routes/postRouter");
const { authenticate } = require("./middlewares/auth.middleware");
require("dotenv").config();

const app=express();

app.use(cors());
app.use('/user',userRouter);
app.use(authenticate);
app.use('/posts',postRouter)

app.listen(process.env.port,()=>{
    try {
        connection
        console.log(`Connected to the DB and server is running at ${process.env.port}`)
    } catch (error) {
        console.log(error);
        console.log("Error in connecting to the DB")
    }
})