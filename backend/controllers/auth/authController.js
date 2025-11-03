import User from "../../models/User.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import generateToken from "../../utils/generateToken.js";
import { sendResponse } from "../../utils/responseMessageHelper.js";


const registerUser = asyncHandler(async(req,res)=>{
    const {userName,email,password} = req.body;

    const exitingUser = await User.findOne({email});

    if(exitingUser){
        res.status(400);
        throw new Error('User already exists');
    }



    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.create([{
        userName,
        email,
        password
    }
    ],{session});

    generateToken(res,user[0]._id);

    await session.commitTransaction();
    session.endSession();

    if(user){
       sendResponse(res, 201, true, "User registered successfully", {
            _id: user[0]._id,
            userName: user[0].userName,
            email: user[0].email,
            role:user[0].role
        });
    }else{
        res.status(400);
        throw new Error('Something gone wrong');
    }
});

const signInuser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(user && (await user.matchPasswords(password))){
        generateToken(res,user._id);
        sendResponse(res, 200, true, "User SignedIn successfully", {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            role:user.role
        });
    }else{
        res.status(400);
        throw new Error('Please Check Your Email and Password');
    }
})


const getProfile = asyncHandler(async(req,res)=>{
    const user = {
        _id:req.user._id,
        userName:req.user.userName,
        email:req.user.email,
        role:req.user.role
    }

    res.status(200).json(user); 
})


const updateUser = asyncHandler(async(req,res)=>{

    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error("User Not Found");
    }

    if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({ 
            email: req.body.email,
            _id: { $ne: req.user._id }
        });
        
        if (emailExists) {
            res.status(400);
            throw new Error('Email already in use');
        }
    }

    if(user){
        const isPasswordChanged = req.body.password && req.body.password !== user.password;
        const isEmailChanged = req.body.email && req.body.email !== user.email;
        user.userName = req.body.userName;
        user.email = req.body.email;
        
        if(req.body.password){
            user.password = req.body.password;
            user.tokenVersion +=1;
        }
        
        const updateUserDetails = await user.save();

        if(isPasswordChanged || isEmailChanged){
            res.cookie('jwt','',{
                httpOnly:true,
                expires:new Date(0)
            });

            return sendResponse(res, 200, true, "Password updated successfully. Please log in again.", {
                _id: updateUserDetails._id,
                name: updateUserDetails.userName,
                email: updateUserDetails.email,
            });
        } else {
            return sendResponse(res, 200, true, "Profile updated successfully", {
                _id: updateUserDetails._id,
                name: updateUserDetails.userName,
                email: updateUserDetails.email
            });
        }
    }
})


const logOut = asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0)
    })

    sendResponse(res,200,true,"User logged out successfully")
})


export {registerUser,signInuser,updateUser,logOut,getProfile};