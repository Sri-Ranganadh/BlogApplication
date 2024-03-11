const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    title : {
        type: String,
        required : true,
        unique : true
    },
    description : {
        type : String,
        require : true
    },
    photo : {
        type : String,
        required : false
    },
    author : {
        type : String,
        required :true
    },
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment",
        default : []
    }]

},{timestamps:true})

const Post = mongoose.model("Post",PostSchema)

module.exports = Post