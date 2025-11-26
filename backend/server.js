import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import compression from 'compression';
import morgan from 'morgan';
import connectDB from './config/db.js';

import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { generalLimiter, authLimiter, paymentLimiter, adminLimiter } from './middleware/rateLimiter.js';

import authRouter from './routes/auth/authRoutes.js';
import adminProductRouter from './routes/admin/productRoute.js';
import userProductRouter from './routes/user/productRoute.js';
import cartRouter from './routes/user/cartRoute.js';
import addressRouter from './routes/user/addressRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import userOrderRouter from './routes/user/orderRoute.js';
import shippingFeeRouter from './routes/user/shippingRoute.js';
import { adminOrderRouter } from './controllers/admin/orderController.js';
import sanitize from 'mongo-sanitize';

const port = process.env.PORT || 5000;
const isDevelopment = process.env.NODE_ENV === 'development';

connectDB();

const app = express();

if (!isDevelopment) {
  app.set('trust proxy', 1);
}


// SECURITY MIDDLEWARE


app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", process.env.FRONTEND_URL],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS
const allowedOrigins = isDevelopment 
  ? ['http://localhost:5173', 'http://localhost:3000']
  : [process.env.FRONTEND_URL];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET, {
  httpOnly: true,
  secure: !isDevelopment,
  sameSite: 'strict'
}));

// Prevent NoSQL Injection
app.use((req, res, next) => {
  if (req.body) req.body = sanitize(req.body);

  if (req.params) {
    Object.keys(req.params).forEach(key => {
      req.params[key] = sanitize(req.params[key]);
    });
  }

  if (req.query) {
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitize(req.query[key]);
    });
  }

  next();
});

//  HTTP Parameter Pollution
app.use(hpp({
  whitelist: ['price', 'rating', 'category', 'sort', 'limit', 'page']
}));

// gzip compression
app.use(compression());

// logging
app.use(morgan(isDevelopment ? 'dev' : 'combined'));

// rate limiter for public routes
app.use('/api/v1/user/products', generalLimiter);
app.use('/api/v1/public', generalLimiter);


// HEALTH CHECK


app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// ---------------------------------------------------------
// ROUTES
// ---------------------------------------------------------

// auth
app.use('/api/v1/auth', authLimiter, authRouter);

// admin
app.use('/api/v1/admin', adminLimiter, adminProductRouter);
app.use('/api/v1/admin', adminLimiter, adminOrderRouter);

// user
app.use('/api/v1/user', userProductRouter);
app.use('/api/v1/user', cartRouter);
app.use('/api/v1/user', addressRouter);
app.use('/api/v1/user', paymentLimiter, paymentRouter);
app.use('/api/v1/user', userOrderRouter);
app.use('/api/v1/user', shippingFeeRouter);

// root
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'EasyCom API Server',
    version: '1.0.0',
    status: 'running'
  });
});


// ERROR HANDLERS


app.use(notFound);
app.use(errorHandler);


// PROCESS HANDLERS


const server = app.listen(port, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

// Shutdown on SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down...');
  server.close(() => console.log('✅ Process terminated'));
});

export default app;
