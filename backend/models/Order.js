import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    
    orderNumber: {
        type: String,
        unique: true,
        required: true,
    },
    
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
        },
        image: String,
        variant: mongoose.Schema.Types.Mixed,
    }],
    
    shippingAddress: {
        fullName: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
    },
   
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    
    paymentMethod: {
        type: String,
        enum: ['card','cash_on_delivery'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
        index: true,
    },
    transactionId: String,
    
    orderStatus: {
        type: String,
        enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'confirmed',
        index: true,
    },
    
    trackingNumber: String,
    carrier: String,
    
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,    
}, {
    timestamps: true,
});

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });

orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;