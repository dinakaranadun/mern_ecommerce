import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

const authMiddleware = asyncHandler(async(req,resizeBy,next)=>{
    let token = req.cookies.jwt;

    if(token){
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                res.status(401);
                throw new Error("Token invalid or expired");
                
            }
            req.user = user;
            next();

        } catch (error) {
            resizeBy.status(401);
            throw new Error('Invalid Token');
        }

    }else{
        resizeBy.status(401);
        throw new Error("Unauthorized - No Token")
    }
})

export {authMiddleware};