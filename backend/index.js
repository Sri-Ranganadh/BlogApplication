const express = require("express")
const dotenv=require('dotenv')
const cors = require("cors")
const  userRouter  = require("./routes/user")
const  postRouter  = require("./routes/post")
const  commentRouter  = require("./routes/comments")
const cookieparser = require("cookie-parser")
const mongoose = require("mongoose")

const app = express()


const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database is connected successfully!")

    }
    catch(err){
        console.log(err)
    }
}

//middleware
dotenv.config()
app.use(cors())
app.use(express.json())
app.use(cookieparser())

app.use("/api/v1/user",userRouter)
app.use("/api/v1/post",postRouter)
app.use("/api/v1/comments",commentRouter)


const Port = process.env.PORT|| 4000

app.listen(Port,()=>{
    connectDB()
    console.log(`listening on port : ${Port}`)
})