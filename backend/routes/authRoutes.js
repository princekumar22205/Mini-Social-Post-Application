const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

//create the user - signUp

router.post("/signUp", async(req, res)=>{
    const {username, email, password} = req.body;

    const exist = await User.findOne({email});
    if(exist){
        return res.status(400).json({message:"user already exist"});
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await User.create({
       username,
        email,
        password : hashedpassword
    });
    res.status(201).json({message:"user is successfully created"});
});


// login existing user

router.post("/login", async(req,res)=>{
    try{
        console.log('Login attempt:', req.body);
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "email and password required"});
        }

        const exist = await User.findOne({email});
        if(!exist){
            return res.status(400).json({message:"invalid credential"})
        }

        const Ismatch = await bcrypt.compare(password, exist.password);
        if(!Ismatch){
            return res.status(400).json({message:"invalid credential"})
        }

        const token = jwt.sign({
            id: exist._id,
            username: exist.username
        },
        process.env.JWT_SECRET,
        { expiresIn : "1d"}
    );
        res.json({token, username: exist.username });
    } catch(err){
        console.error('Login error:', err);
        res.status(500).json({message: 'Server error'});
    }
})


module.exports = router;