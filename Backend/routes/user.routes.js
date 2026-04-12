const express=require('express');
const router=express.Router();
const {body}=require("express-validator")


router.post("/register",[
    body('email').isEmail().withMessage("please enter valid email"),
    body('password').isLength({min:6}).withMessage("password should be of atleast 6 characters"),
    body('fullname.firstname').isLength({min:3}).withMessage("firstname should be of atleast 3 characters"),
])
module.exports=router