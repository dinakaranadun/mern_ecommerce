import express from 'express'
import { adminMiddleware, authMiddleware } from '../../middleware/authMiddleware.js';
import { getAllOrders, getOrderAnalytics, getOrdersByDateRange, updateOrderStatusAdmin, updatePaymentStatusAdmin } from '../order/orderController.js';

const adminOrderRouter = express.Router();

adminOrderRouter.get('/orders',authMiddleware,adminMiddleware,getAllOrders);
adminOrderRouter.get('/order/anlytics',authMiddleware,adminMiddleware,getOrderAnalytics);
adminOrderRouter.get('/order/anlyticsByRange',authMiddleware,adminMiddleware,getOrdersByDateRange);
adminOrderRouter.patch('/order/:orderId/updateOrderStatus',authMiddleware,adminMiddleware,updateOrderStatusAdmin);
adminOrderRouter.patch('/order/:id/updateOrderPaymentStatus',authMiddleware,adminMiddleware,updatePaymentStatusAdmin);
// adminOrderRouter.get('/order/anlytics',authMiddleware,adminMiddleware,);

export{adminOrderRouter};