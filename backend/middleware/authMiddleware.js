import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

// 1. AUTH MIDDLEWARE - Check if user is logged in
const authMiddleware = asyncHandler(async(req, res, next) => {
    let token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const user = await User.findById(decoded.userId).select('-password');
            
            if (!user) {
                res.status(401);
                throw new Error("Token invalid or expired");
            }
            
            req.user = user;
            next();

        } catch (error) {
            res.status(401);
            throw new Error('Invalid Token');
        }
    } else {
        res.status(401);
        throw new Error("Unauthorized - No Token");
    }
});


// 2. ADMIN MIDDLEWARE - Check if user is admin
const adminMiddleware = asyncHandler(async(req, res, next) => {
    if (!req.user) {
        res.status(401);
        throw new Error("Not authenticated");
    }

    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error("Access denied. Admin only.");
    }

    next();
});

export {authMiddleware,adminMiddleware};