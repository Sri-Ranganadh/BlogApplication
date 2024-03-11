const express = require("express")
const verifyToken = require("../middleware/authMiddleware")
const Post = require("../models/Post")
const Comment = require("../models/Comment")
const commentRouter = express.Router()

commentRouter.post("/create",verifyToken,async (req,res)=>{
    try{
        const postId = req.body.postId
        const post = await Post.findById(postId)
        if(!post){
            return res.json("No post")
        }
        const newComment= await Comment.create(req.body)
        if(!newComment){
            return res.json("error to create comment")
        }
        post.comments.push(newComment._id)
        await post.save()
        res.status(200).json(newComment)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
     
})

//UPDATE
commentRouter.put("/:id",verifyToken,async (req,res)=>{
    try{
       
        const updatedComment=await Comment.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedComment)

    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})


//DELETE
commentRouter.delete("/:id",verifyToken,async (req,res)=>{
    try{
        const comment = await Comment.findByIdAndDelete(req.params.id)
        const post = await Post.findById(comment.postId)
        post.comments = post.comments.filter(id => id.toString()!= req.params.id)
        await post.save()
        res.status(200).json("Comment has been deleted!")

    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})




//GET POST COMMENTS
commentRouter.get("/post/:postId",async (req,res)=>{
    try{
        const comments=await Comment.find({postId:req.params.postId})
        res.status(200).json(comments)
    }
    catch(err){
        res.status(500).json(err)
    }
})
module.exports = commentRouter