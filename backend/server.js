import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config();
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';

import { errorHandler, notFound } from './middleware/errorMiddleware.js';

import authRouter from './routes/auth/authRoutes.js';
import adminProductRouter from './routes/admin/productRoute.js';


const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials: true
    })
);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


//routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/admin',adminProductRouter);
app.get('/',(req,res)=>res.send('server is ready'));

//error handler middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port,() => console.log(`server started ons port ${port}`)); 