const jwt=require('jsonwebtoken')

const verifyToken=async(req,res,next)=>{
    const token=req.cookies.token
    // console.log(token)
    if(!token){
        return res.status(401).json("You are not authenticated!")
    }
    const data = jwt.verify(token,process.env.JWT_SECRET)
        if(!data){
            return res.status(403).json("Token is not valid!")
        }
        
        req.userId=data.id
        
        next()
    }


module.exports=verifyToken