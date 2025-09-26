import User from "../../models/user";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import generateToken from "../../utils/generateToken";


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
        res.status(201).json({
            _id:user[0].id,
            name:user[0].userName,
            email:user[0].email
        });
    }else{
        res.status(400);
        throw new Error('Something gone wrong');
    }
});

const signInuser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;

    const user = await mongoose.findOne({email});
    if(user && (await user.matchPasswords(password))){
        generateToken(res,user._id);
        res.status(200).json({
            _id:user.id,
            name:user.userName,
            email:user.email
        })
    }else{
        res.status(400);
        throw new Error('Please Check Your Email and Password');
    }
})


export {registerUser,signInuser};