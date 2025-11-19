import asyncHandler from 'express-async-handler';
import { sendResponse } from '../../utils/responseMessageHelper.js';
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import mongoose from 'mongoose';

// ==================== USER ROUTES ====================

const createOrder = asyncHandler(async (req, res) => {
    const {
        items,
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingFee,
        totalAmount,
        paymentStatus = 'pending',
        orderStatus = 'pending'
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

    if (!paymentMethod || !['card', 'cod'].includes(paymentMethod)) {
        sendResponse(res, 400, false, 'Valid payment method is required (card or cod)');
        return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const productIds = items.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } }).session(session);

        if (products.length !== items.length) {
            throw new Error('Some products were not found');
        }

        const productMap = {};
        products.forEach(product => {
            productMap[product._id.toString()] = product;
        });

        for (let item of items) {
            const product = productMap[item.productId.toString()];
            
            if (!product) {
                throw new Error(`Product not found: ${item.name || item.productId}`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
            }
        }

        // Create order
        const order = new Order({
            userId,
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            shippingFee,
            totalAmount,
            paymentStatus, 
            orderStatus   
        });

        const createdOrder = await order.save({ session });

        if (paymentMethod === 'cod' && orderStatus === 'confirmed') {
            for (let item of items) {
                const updateResult = await Product.findByIdAndUpdate(
                    item.productId,
                    { 
                        $inc: { stock: -item.quantity },
                        $set: { updatedAt: new Date() }
                    },
                    { session, new: true }
                );

                if (!updateResult) {
                    throw new Error(`Failed to update stock for product: ${item.productId}`);
                }
            }
        }

        await session.commitTransaction();
        
        sendResponse(res, 201, true, 'Order created successfully', createdOrder);
    } catch (error) {
        await session.abortTransaction();
        console.error('Order creation error:', error);
        sendResponse(res, 400, false, error.message || 'Failed to create order');
    } finally {
        session.endSession();
    }
});


const updateOrderStatus = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const { 
        paymentStatus, 
        orderStatus, 
        transactionId, 
        failureReason 
    } = req.body;

    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
        sendResponse(res, 404, false, 'Order not found');
        return;
    }

    if (order.userId.toString() !== userId.toString()) {
        sendResponse(res, 403, false, 'Not authorized to update this order');
        return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const updates = {};
        let shouldUpdateStock = false;

        if (paymentStatus) {
            const validPaymentStatuses = ['pending', 'completed', 'failed'];
            if (!validPaymentStatuses.includes(paymentStatus)) {
                throw new Error('Invalid payment status');
            }
            updates.paymentStatus = paymentStatus;

            if (transactionId && paymentStatus === 'completed') {
                updates.transactionId = transactionId;
            }

            if (failureReason && paymentStatus === 'failed') {
                updates.failureReason = failureReason;
            }
        }

        // Update order status
        if (orderStatus) {
            const validOrderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
            if (!validOrderStatuses.includes(orderStatus)) {
                throw new Error('Invalid order status');
            }
            updates.orderStatus = orderStatus;

            if (orderStatus === 'confirmed' && !order.confirmedAt) {
                updates.confirmedAt = new Date();
                
                if (order.paymentMethod === 'card' && paymentStatus === 'completed') {
                    shouldUpdateStock = true;
                }
            } else if (orderStatus === 'cancelled') {
                updates.cancelledAt = new Date();
                
                if (order.orderStatus === 'confirmed' || order.orderStatus === 'processing') {
                    for (let item of order.items) {
                        await Product.findByIdAndUpdate(
                            item.productId,
                            { 
                                $inc: { stock: item.quantity },
                                $set: { updatedAt: new Date() }
                            },
                            { session }
                        );
                    }
                }
            }
        }

        // Update stock for confirmed card payments
        if (shouldUpdateStock) {
            for (let item of order.items) {
                const product = await Product.findById(item.productId).session(session);
                
                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`);
                }

                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
                }

                await Product.findByIdAndUpdate(
                    item.productId,
                    { 
                        $inc: { stock: -item.quantity },
                        $set: { updatedAt: new Date() }
                    },
                    { session }
                );
            }
        }

        updates.updatedAt = new Date();
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: updates },
            { new: true, runValidators: true, session }
        );

        await session.commitTransaction();

        sendResponse(res, 200, true, 'Order status updated successfully', updatedOrder);
    } catch (error) {
        await session.abortTransaction();
        console.error('Order status update error:', error);
        sendResponse(res, 400, false, error.message || 'Failed to update order status');
    } finally {
        session.endSession();
    }
});


const getOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { userId };
    if (status) {
        query.orderStatus = status;
    }

    const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('items.productId', 'name image price')
        .lean();

    const count = await Order.countDocuments(query);

    sendResponse(res, 200, true, 'Orders retrieved successfully', {
        orders,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalOrders: count
    });
});

const getOrderById = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user._id;

    const order = await Order.findById(orderId)
        .populate({
            path: 'items.productId',
            select: 'name image price rating reviews' 
        })
        .lean();

    if (!order) {
        sendResponse(res, 404, false, 'Order not found');
        return;
    }

    if (order.userId.toString() !== userId.toString()) {
        sendResponse(res, 403, false, 'Not authorized to view this order');
        return;
    }

    order.items = order.items.map(item => {
        const product = item.productId;
        const userReview = product?.reviews?.find(
            r => r.user.toString() === userId.toString()
        );
        return {
            ...item,
            productId: {
                ...product,
                userReview: userReview || null
            }
        };
    });

    sendResponse(res, 200, true, 'Order retrieved successfully', order);
});



const cancelOrder = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
        sendResponse(res, 404, false, 'Order not found');
        return;
    }

    if (order.userId.toString() !== userId.toString()) {
        sendResponse(res, 403, false, 'Not authorized to cancel this order');
        return;
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
        sendResponse(res, 400, false, `Cannot cancel order with status: ${order.orderStatus}`);
        return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (order.orderStatus === 'confirmed' || order.orderStatus === 'processing') {
            for (let item of order.items) {
                await Product.findByIdAndUpdate(
                    item.productId,
                    { 
                        $inc: { stock: item.quantity },
                        $set: { updatedAt: new Date() }
                    },
                    { session }
                );
            }
        }

        // Update order status
        order.orderStatus = 'cancelled';
        order.cancelledAt = new Date();
        order.updatedAt = new Date();

        await order.save({ session });
        await session.commitTransaction();

        sendResponse(res, 200, true, 'Order cancelled successfully', order);
    } catch (error) {
        await session.abortTransaction();
        console.error('Order cancellation error:', error);
        sendResponse(res, 400, false, error.message || 'Failed to cancel order');
    } finally {
        session.endSession();
    }
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
                pending: {
                    $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
                },
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
        pending: 0,
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
    const { status, paymentStatus, page = 1, limit = 20, sortBy = 'createdAt' } = req.query;

    const query = {};
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
        .populate('userId', 'name email')
        .populate('items.productId', 'name image')
        .sort({ [sortBy]: -1 })
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


const updateOrderStatusAdmin = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const { orderStatus, trackingNumber, carrier } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        sendResponse(res, 404, false, 'Order not found');
        return;
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(orderStatus)) {
        sendResponse(res, 400, false, 'Invalid order status');
        return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        order.orderStatus = orderStatus;

        if (orderStatus === 'confirmed' && !order.confirmedAt) {
            order.confirmedAt = new Date();
        } else if (orderStatus === 'shipped') {
            order.shippedAt = new Date();
            if (trackingNumber) order.trackingNumber = trackingNumber;
            if (carrier) order.carrier = carrier;
        } else if (orderStatus === 'delivered') {
            order.deliveredAt = new Date();
        } else if (orderStatus === 'cancelled') {
            order.cancelledAt = new Date();
            
            // Restore stock if cancelled
            if (order.orderStatus === 'confirmed' || order.orderStatus === 'processing') {
                for (let item of order.items) {
                    await Product.findByIdAndUpdate(
                        item.productId,
                        { 
                            $inc: { stock: item.quantity },
                            $set: { updatedAt: new Date() }
                        },
                        { session }
                    );
                }
            }
        }

        order.updatedAt = new Date();
        await order.save({ session });
        await session.commitTransaction();

        sendResponse(res, 200, true, 'Order status updated successfully', order);
    } catch (error) {
        await session.abortTransaction();
        console.error('Admin order update error:', error);
        sendResponse(res, 400, false, error.message || 'Failed to update order');
    } finally {
        session.endSession();
    }
});


const updatePaymentStatusAdmin = asyncHandler(async (req, res) => {
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
    order.updatedAt = new Date();

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

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Restore stock before deleting if order was confirmed
        if (order.orderStatus === 'confirmed' || order.orderStatus === 'processing') {
            for (let item of order.items) {
                await Product.findByIdAndUpdate(
                    item.productId,
                    { 
                        $inc: { stock: item.quantity },
                        $set: { updatedAt: new Date() }
                    },
                    { session }
                );
            }
        }

        await order.deleteOne({ session });
        await session.commitTransaction();

        sendResponse(res, 200, true, 'Order deleted successfully');
    } catch (error) {
        await session.abortTransaction();
        console.error('Order deletion error:', error);
        sendResponse(res, 400, false, error.message || 'Failed to delete order');
    } finally {
        session.endSession();
    }
});


const getOrderAnalytics = asyncHandler(async (req, res) => {
    const analytics = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totalAmount' },
                averageOrderValue: { $avg: '$totalAmount' },
                pending: {
                    $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
                },
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
                failedPayments: {
                    $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, 1, 0] }
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
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        completedPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        completedRevenue: 0
    };

    const recentOrders = await Order.find()
        .populate('userId', 'name email')
        .populate('items.productId', 'name')
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

    const totalRevenue = orders.reduce((sum, order) => {
        return order.paymentStatus === 'completed' ? sum + order.totalAmount : sum;
    }, 0);

    sendResponse(res, 200, true, 'Orders retrieved successfully', {
        orders,
        count: orders.length,
        totalRevenue
    });
});

export {
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
};