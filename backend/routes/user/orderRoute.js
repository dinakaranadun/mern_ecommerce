import express from 'express'
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { cancelOrder, createOrder, getOrderById, getOrders, getOrderStats, updateOrderToPaid } from '../../controllers/order/orderController.js';


const userOrderRouter = express.Router();

userOrderRouter.get('/orders',authMiddleware,getOrders);
userOrderRouter.get('/order/:id',authMiddleware,getOrderById);
userOrderRouter.get('/order/stats',authMiddleware,getOrderStats);
userOrderRouter.post('/order',authMiddleware,createOrder);
userOrderRouter.put('/order/:id/update',authMiddleware,updateOrderToPaid);
userOrderRouter.delete('/order/:id',authMiddleware,cancelOrder);

export default userOrderRouter;


