const express = require("express")
const verifyToken = require("../middleware/authMiddleware")
const Post = require("../models/Post")
const User = require("../models/User")
const Comment = require("../models/Comment")

const postRouter = express.Router()

postRouter.post('/create',verifyToken,async(req,res)=>{
    try {
        const data = {title : req.body.title,description:req.body.description,author : req.userId}
        const user = await User.findById(req.userId)
        const newPost = await Post.create(data)
        user.posts.push(newPost._id)
        await user.save()
        if(!newPost){
            return res.status(411).json({msg : "Error to create post"})
        }
        res.status(200).json({msg : "Post Created successfully"})

    } catch (error) {
        console.log(error)
        return res.status(411).json({msg : "Error to create post"})
    }
    
})

postRouter.put('/:id',verifyToken,async(req,res)=>{
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        if(!updatedPost){
            return res.status(411).json({msg : "Error to create post"})
        }
        res.status(200).json({msg : "Post Updated successfully"})

    } catch (error) {
        console.log(error)
        return res.status(411).json({msg : "Error to create post"})
    }
})

postRouter.delete("/:id",verifyToken,async(req,res)=>{
    try {
        const user = await User.findById(req.userId)
        const deletePost = await Post.findByIdAndDelete(req.params.id)
        await Comment.deleteMany({_id : {$in : deletePost.comments}})
        user.posts = user.posts.filter(id => id.toString() != req.params.id)
        await user.save()
        if(!user || !deletePost){
            return res.status(411).json({msg : "Error to deleting post"})
        }
        res.status(200).json({msg : "Post Deleted successfully"})
    } catch (error) {
        console.log(error)
        return res.status(411).json({msg : "Error to deleting post"})
    }
})



postRouter.get("/:id",verifyToken,async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id).populate("comments")
        if(!post){
            return res.status(411).json({msg:"No data found"})
        }
        res.status(200).json(post)
    }
    catch(err){
        res.status(500).json(err)
    }
})

postRouter.get("/",verifyToken,async(req,res)=>{
    try{
        const posts=await Post.find()
        if(!posts){
            return res.status(411).json({msg:"No data found"})
        }
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json(err)
    }
})

postRouter.get("/user/:userId",async (req,res)=>{
    try{
        const posts=await User.findById(req.params.userId).populate("posts").select("posts")
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports = postRouter