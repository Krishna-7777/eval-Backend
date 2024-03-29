const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
require("dotenv").config();

const userRouter = express.Router();

userRouter.use(express.json())

userRouter.post('/register', (ask, give) => {
    let { name, email, gender, password } = ask.body;
    bcrypt.hash(password, 3, async (err, hashed) => {
        if (hashed) {
            let user = new UserModel({ name, email, gender, 'password': hashed });
            await user.save();
            give.send({ "msg": "User have been registered" })
        }
    })
});

userRouter.post('/login', async (ask, give) => {
    let { email, password } = ask.body;
    let user = await UserModel.findOne({ email });
    let hash = user.password;
    bcrypt.compare(password, hash, async (err, result) => {
        if (result) {
            let token=jwt.sign({"_id":user._id},process.env.secret);
            give.send({ "msg": "Login Succesful","token":token});
        } else {
            give.send({ "msg": "Wrong Credentials" })
        }
    })
});

module.exports = {
    userRouter
}