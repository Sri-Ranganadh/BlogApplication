const User = require("../models/User")
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userRouter = express.Router()

userRouter.post('/signup',async(req,res)=>{
    try {
        const {name,email,password} = req.body
        const salt = await bcrypt.genSalt(10)
        const hashP = bcrypt.hashSync(password,salt)
        const isPresent = await User.findOne({
            email : email
        })
        if(isPresent){
            return res.status(411).json({msg : "User Exist"})
        }
        const user = await User.create({
            name,
            email,
            password : hashP
        })
        if(!user){
            return res.status(411).json({msg : "Error occured"})
        }
        else{
            const token = jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
            res.cookie("token",token)
            res.status(200).json({
                msg : "Signup Successful",
                data : {name : name,email : email}
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(411).json({
            msg : "Error in Signup"
        })
    }    
})

userRouter.post('/login',async(req,res)=>{
    try {
        const user = await User.findOne({
            email:req.body.email,
        })
        if(!user){
            return res.status(411).json({msg : "User doesn't exist"})
        }
        const match = await bcrypt.compare(req.body.password,user.password)
        if(!match){
            return res.status(411).json({msg : "Invalid Credentials"})
        }

        const token = jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
        const {password,...udata} = user._doc
        res.cookie("token",token)
        res.status(200).json({
            msg : "Signin Successful",
            data : udata
        })

    } catch (error) {
        console.log(error)
        return res.status(411).json({
            msg : "Error in login"
        })
    }    
})

userRouter.get("/logout",async (req,res)=>{
    try{
        res.clearCookie("token",{sameSite:"none",secure:true}).status(200).json({msg : "User logged out successfully!"})
    }
    catch(err){
        res.status(500).json(err)
    }
})


module.exports = userRouter