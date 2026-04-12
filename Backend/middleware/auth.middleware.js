const userModel=require('../models/user.model')
const tokenBlacklistModel=require('../models/blacklistToken.model')
const bcrypt =require("bcrypt");
const jwt=require("jsonwebtoken");


module.exports.authUser=async(req,res,next)=>{
    const token=req.cookies.token||req.headers.authorization.split(' ')[1];

    if(!token)
    {
        return res.status(401).json({message:'Unauthorized token'})
    }
     const isTokenBlacklisted=await tokenBlacklistModel.findOne({token})
    if(isTokenBlacklisted)
    {
        return res.send(401).json({
            message:"token is invalid"
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await userModel.findById(decoded._id)
        req.user=user
        return next()
    }
    catch(err)
    {
        res.status(401).json({message:"Unauthorized access"})
    }
}