const mongoose=require('mongoose')
const blacklistTokenSchema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required"],

    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:86400
    }
})

const blacklistTokenModel=mongoose.model('blacklistTokens',blacklistTokenSchema)
module.exports=blacklistTokenModel