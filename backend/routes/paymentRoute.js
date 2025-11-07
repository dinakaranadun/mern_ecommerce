import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { makePaymentIntent } from '../controllers/paymentController.js';


const paymentRouter = express.Router();

paymentRouter.post('payment/create-intent',authMiddleware,makePaymentIntent);

export default paymentRouter;