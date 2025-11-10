import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config();
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';

import { errorHandler, notFound } from './middleware/errorMiddleware.js';

import authRouter from './routes/auth/authRoutes.js';
import adminProductRouter from './routes/admin/productRoute.js';
import userProductRouter from './routes/user/productRoute.js';
import cartRouter from './routes/user/cartRoute.js';
import addressRouter from './routes/user/addressRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import userOrderRouter from './routes/user/orderRoute.js';
import shippingFeeRouter from './routes/user/shippingRoute.js';


const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
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
app.use('/api/v1/user',userProductRouter);
app.use('/api/v1/user',cartRouter);
app.use('/api/v1/user',addressRouter);
app.use('/api/v1/user',paymentRouter);
app.use('/api/v1/user',userOrderRouter);
app.use('/api/v1/user',shippingFeeRouter);
app.get('/',(req,res)=>res.send('server is ready'));

//error handler middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port,() => console.log(`server started ons port ${port}`)); 