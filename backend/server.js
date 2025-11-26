import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import compression from 'compression';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { 
  generalLimiter, 
  authLimiter, 
  paymentLimiter, 
  adminLimiter 
} from './middleware/rateLimiter.js';
import authRouter from './routes/auth/authRoutes.js';
import adminProductRouter from './routes/admin/productRoute.js';
import userProductRouter from './routes/user/productRoute.js';
import cartRouter from './routes/user/cartRoute.js';
import addressRouter from './routes/user/addressRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import userOrderRouter from './routes/user/orderRoute.js';
import shippingFeeRouter from './routes/user/shippingRoute.js';
import { adminOrderRouter } from './controllers/admin/orderController.js';

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
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"], 
    },
  },
  crossOriginEmbedderPolicy: false, 
}));

// CORS 
const allowedOrigins = isDevelopment 
  ? ['http://localhost:5173', 'http://localhost:3000']
  : [process.env.FRONTEND_URL]; 

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Expires',
      'Pragma',
    ],
    credentials: true,
    maxAge: 86400, 
  })
);

// Body parsing 
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());



app.use((req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  }
  if (req.params) {
    req.params = mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  }
  next();
});



// HTTP Parameter Pollution
app.use(hpp({
  whitelist: [
    'price', 
    'rating', 
    'category', 
    'sort',
    'limit',
    'page'
  ] 
}));

// 7. Compression
app.use(compression());


if (isDevelopment) {
  app.use(morgan('dev')); 
} else {
  app.use(morgan('combined')); 
}


// RATE LIMITING

app.use(generalLimiter);


// SECURITY HEADERS 

app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});


// HEALTH CHECK ENDPOINT

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});


// API ROUTES


// Auth routes
app.use('/api/v1/auth', authLimiter, authRouter);

// Admin routes
app.use('/api/v1/admin', adminLimiter, adminProductRouter);
app.use('/api/v1/admin', adminLimiter, adminOrderRouter);

// User routes
app.use('/api/v1/user', userProductRouter);
app.use('/api/v1/user', cartRouter);
app.use('/api/v1/user', addressRouter);
app.use('/api/v1/user', paymentLimiter, paymentRouter);
app.use('/api/v1/user', userOrderRouter);
app.use('/api/v1/user', shippingFeeRouter);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'EasyCom API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
  console.log(`🔒 Security features enabled`);
  console.log(`🚀 Health check available at: http://localhost:${port}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// shutdown on SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

export default app;