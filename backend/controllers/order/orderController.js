import asyncHandler from 'express-async-handler';
import { sendResponse } from '../../utils/responseMessageHelper.js';
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';

const createOrder = asyncHandler(async (req, res) => {
    const {
        items,
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingCost,
        totalAmount,
        transactionId
    } = req.body;

    const userId = req.user._id;

    if (!items || items.length === 0) {
        sendResponse(res, 400, false, 'No order items provided');
        return;
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1) {
        sendResponse(res, 400, false, 'Complete shipping address is required');
        return;
    }

    if (!paymentMethod || !['card', 'cash_on_delivery'].includes(paymentMethod)) {
        sendResponse(res, 400, false, 'Valid payment method is required');
        return;
    }

    // Verify products exist and have sufficient stock
    for (let item of items) {
        const product = await Product.findById(item.productId);
        
        if (!product) {
            sendResponse(res, 404, false, `Product not found: ${item.name || item.productId}`);
            return;
        }

        if (product.stock < item.quantity) {
            sendResponse(res, 400, false, `Insufficient stock for ${product.name}. Available: ${product.stock}`);
            return;
        }

       
    }

  
    const order = new Order({
        userId,
        items,
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingCost,
        totalAmount,
        transactionId,
        paymentStatus: paymentMethod === 'card' ? 'pending' : 'pending',
        orderStatus: 'confirmed'
    });

    const createdOrder = await order.save();

    // Update product stock
    for (let item of items) {
        await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: -item.quantity } }
        );
    }

    sendResponse(res, 201, true, 'Order placed successfully', createdOrder);
});


const getOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
        .sort({ createdAt: -1 })
        .populate('items.productId', 'name image')
        .lean();

    if (!orders || orders.length === 0) {
        sendResponse(res, 404, false, 'No orders found');
        return;
    }

    sendResponse(res, 200, true, 'Orders retrieved successfully', orders);
});


const getOrderById = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user._id;

    const order = await Order.findById(orderId)
        .populate('items.productId', 'name image price')
        .lean();

    if (!order) {
        sendResponse(res, 404, false, 'Order not found');
        return;
    }

    if (order.userId.toString() !== userId.toString()) {
        sendResponse(res, 403, false, 'Not authorized to view this order');
        return;
    }

    sendResponse(res, 200, true, 'Order retrieved successfully', order);
});


const updateOrderToPaid = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const { transactionId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        sendResponse(res, 404, false, 'Order not found');
        return;
    }

 
    if (order.userId.toString() !== req.user._id.toString()) {
        sendResponse(res, 403, false, 'Not authorized to update this order');
        return;
    }

    if (order.paymentStatus === 'completed') {
        sendResponse(res, 400, false, 'Order is already paid');
        return;
    }

    order.paymentStatus = 'completed';
    order.transactionId = transactionId;
    order.confirmedAt = Date.now();

    const updatedOrder = await order.save();

    sendResponse(res, 200, true, 'Payment completed successfully', updatedOrder);
});


const cancelOrder = asyncHandler(async (req, res) => {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
        sendResponse(res, 404, false, 'Order not found');
        return;
    }

    
    if (order.userId.toString() !== req.user._id.toString()) {
        sendResponse(res, 403, false, 'Not authorized to cancel this order');
        return;
    }

    
    if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
        sendResponse(res, 400, false, 'Cannot cancel shipped or delivered orders');
        return;
    }

    if (order.orderStatus === 'cancelled') {
        sendResponse(res, 400, false, 'Order is already cancelled');
        return;
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = Date.now();

    // Restore product stock
    for (let item of order.items) {
        await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: item.quantity } }
        );
    }

    const updatedOrder = await order.save();

    sendResponse(res, 200, true, 'Order cancelled successfully', updatedOrder);
});

const getOrderStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const stats = await Order.aggregate([
        { $match: { userId: userId } },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalSpent: { $sum: '$totalAmount' },
                confirmed: {
                    $sum: { $cond: [{ $eq: ['$orderStatus', 'confirmed'] }, 1, 0] }
                },
                processing: {
                    $sum: { $cond: [{ $eq: ['$orderStatus', 'processing'] }, 1, 0] }
                },
                shipped: {
                    $sum: { $cond: [{ $eq: ['$orderStatus', 'shipped'] }, 1, 0] }
                },
                delivered: {
                    $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
                },
                cancelled: {
                    $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
                }
            }
        }
    ]);

    const result = stats.length > 0 ? stats[0] : {
        totalOrders: 0,
        totalSpent: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    };

    sendResponse(res, 200, true, 'Order statistics retrieved successfully', result);
});

// ==================== ADMIN ROUTES ====================

const getAllOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;

    const query = status ? { orderStatus: status } : {};

    const orders = await Order.find(query)
        .populate('userId', 'name email')
        .populate('items.productId', 'name image')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

    const count = await Order.countDocuments(query);

    sendResponse(res, 200, true, 'All orders retrieved successfully', {
        orders,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalOrders: count
    });
});


const updateOrderStatus = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const { orderStatus, trackingNumber, carrier } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        sendResponse(res, 404, false, 'Order not found');
        return;
    }

    const validStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(orderStatus)) {
        sendResponse(res, 400, false, 'Invalid order status');
        return;
    }

    order.orderStatus = orderStatus;

    if (orderStatus === 'confirmed' && !order.confirmedAt) {
        order.confirmedAt = Date.now();
    } else if (orderStatus === 'shipped') {
        order.shippedAt = Date.now();
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (carrier) order.carrier = carrier;
    } else if (orderStatus === 'delivered') {
        order.deliveredAt = Date.now();
    } else if (orderStatus === 'cancelled') {
        order.cancelledAt = Date.now();
        
        // Restore stock if cancelled
        for (let item of order.items) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: item.quantity } }
            );
        }
    }

    const updatedOrder = await order.save();

    sendResponse(res, 200, true, 'Order status updated successfully', updatedOrder);
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const { paymentStatus, transactionId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        sendResponse(res, 404, false, 'Order not found');
        return;
    }

    const validPaymentStatuses = ['pending', 'completed', 'failed', 'refunded'];
    
    if (!validPaymentStatuses.includes(paymentStatus)) {
        sendResponse(res, 400, false, 'Invalid payment status');
        return;
    }

    order.paymentStatus = paymentStatus;
    if (transactionId) {
        order.transactionId = transactionId;
    }

    const updatedOrder = await order.save();

    sendResponse(res, 200, true, 'Payment status updated successfully', updatedOrder);
});


const deleteOrder = asyncHandler(async (req, res) => {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
        sendResponse(res, 404, false, 'Order not found');
        return;
    }

    // Restore stock before deleting
    for (let item of order.items) {
        await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: item.quantity } }
        );
    }

    await order.deleteOne();

    sendResponse(res, 200, true, 'Order deleted successfully');
});


const getOrderAnalytics = asyncHandler(async (req, res) => {
    const analytics = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totalAmount' },
                averageOrderValue: { $avg: '$totalAmount' },
                confirmed: {
                    $sum: { $cond: [{ $eq: ['$orderStatus', 'confirmed'] }, 1, 0] }
                },
                processing: {
                    $sum: { $cond: [{ $eq: ['$orderStatus', 'processing'] }, 1, 0] }
                },
                shipped: {
                    $sum: { $cond: [{ $eq: ['$orderStatus', 'shipped'] }, 1, 0] }
                },
                delivered: {
                    $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
                },
                cancelled: {
                    $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
                },
                completedPayments: {
                    $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] }
                },
                pendingPayments: {
                    $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] }
                },
                completedRevenue: {
                    $sum: {
                        $cond: [
                            { $eq: ['$paymentStatus', 'completed'] },
                            '$totalAmount',
                            0
                        ]
                    }
                }
            }
        }
    ]);

    const result = analytics.length > 0 ? analytics[0] : {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        completedPayments: 0,
        pendingPayments: 0,
        completedRevenue: 0
    };

    const recentOrders = await Order.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    sendResponse(res, 200, true, 'Order analytics retrieved successfully', {
        analytics: result,
        recentOrders
    });
});


const getOrdersByDateRange = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        sendResponse(res, 400, false, 'Start date and end date are required');
        return;
    }

    const orders = await Order.find({
        createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    })
    .populate('userId', 'name email')
    .populate('items.productId', 'name')
    .sort({ createdAt: -1 })
    .lean();

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    sendResponse(res, 200, true, 'Orders retrieved successfully', {
        orders,
        count: orders.length,
        totalRevenue
    });
});

export {
    // User routes
    getOrderStats,
    getOrders,
    getOrderById,
    createOrder,
    updateOrderToPaid,
    cancelOrder,
    
    
    // Admin routes
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    getOrderAnalytics,
    getOrdersByDateRange
};