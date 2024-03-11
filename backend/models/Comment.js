const mongoose = require("mongoose")

const commentSchemma = new mongoose.Schema({
    comment:{
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true
    },
    postId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post",
        required : true
    }
},{timestamps : true})

const Comment = mongoose.model('Comment',commentSchemma)

module.exports = Comment