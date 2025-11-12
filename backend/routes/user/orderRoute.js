import express from 'express';
import { authMiddleware, adminMiddleware } from '../../middleware/authMiddleware.js';
import {
    // User routes
    createOrder,
    updateOrderStatus,
    getOrders,
    getOrderById,
    cancelOrder,
    getOrderStats,
    
    // Admin routes
    getAllOrders,
    updateOrderStatusAdmin,
    updatePaymentStatusAdmin,
    deleteOrder,
    getOrderAnalytics,
    getOrdersByDateRange
} from '../../controllers/order/orderController.js';

// ==================== USER ROUTES ====================
const userOrderRouter = express.Router();

userOrderRouter.get('/orders', authMiddleware, getOrders);
userOrderRouter.get('/order/stats', authMiddleware, getOrderStats);
userOrderRouter.get('/order/:id', authMiddleware, getOrderById);
userOrderRouter.post('/order', authMiddleware, createOrder);
userOrderRouter.patch('/order/:id/status', authMiddleware, updateOrderStatus);
userOrderRouter.patch('/order/:id/cancel', authMiddleware, cancelOrder);

// ==================== ADMIN ROUTES ====================
const adminOrderRouter = express.Router();
adminOrderRouter.get('/orders', authMiddleware, adminMiddleware, getAllOrders);
adminOrderRouter.get('/orders/analytics', authMiddleware, adminMiddleware, getOrderAnalytics);
adminOrderRouter.get('/orders/date-range', authMiddleware, adminMiddleware, getOrdersByDateRange);
adminOrderRouter.patch('/order/:id/status', authMiddleware, adminMiddleware, updateOrderStatusAdmin);
adminOrderRouter.patch('/order/:id/payment', authMiddleware, adminMiddleware, updatePaymentStatusAdmin);
adminOrderRouter.delete('/order/:id', authMiddleware, adminMiddleware, deleteOrder);

export default userOrderRouter;