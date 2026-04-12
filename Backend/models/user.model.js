const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt');

const userSchema=new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'name must of atleast 3 letters']
        },
        lastname:{
            type:String,
            minlength:[3,'name must of atleast 3 letters']
        }
    },
    email:
    {
        type:String,
        required:true,
        unique:true,
        minlength:[5,'email must of atleast 5 letters']
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    socketId:{
        type:String
    }
})

userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // ✅ optional but recommended
    );
};
userSchema.methods.comparePassword=async function(password)
{
    return await bcrypt.compare(password,this.password);
}
userSchema.statics.hashPassword=async function(password)
{
    return await bcrypt.hash(password,10);
}

 const userModel=mongoose.model('user',userSchema);
 module.exports =userModel;
