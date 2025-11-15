import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String
    },
    variant: {
        type: String
    }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    addressLine1: {
        type: String,
        required: true,
        trim: true
    },
    addressLine2: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    postalCode: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        index: true,
        sparse: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    items: {
        type: [orderItemSchema],
        required: true,
        validate: [items => items.length > 0, 'Order must have at least one item']
    },

    shippingAddress: {
        type: shippingAddressSchema,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ['card', 'cod'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
        index: true
    },
    transactionId: {
        type: String,
        trim: true,
        sparse: true
    },
    failureReason: {
        type: String,
        trim: true
    },

    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
        index: true
    },

    trackingNumber: {
        type: String,
        trim: true
    },
    carrier: {
        type: String,
        trim: true
    },

    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    shippingFee: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    confirmedAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },

    customerNote: {
        type: String,
        trim: true,
        maxlength: 500
    },
    adminNote: {
        type: String,
        trim: true,
        maxlength: 1000
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

/* ---------------- INDEXES ---------------- */
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ transactionId: 1 }, { sparse: true });
orderSchema.index({ 'shippingAddress.city': 1 });

/* ---------------- VIRTUALS ---------------- */
orderSchema.virtual('orderAgeInDays').get(function () {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

orderSchema.virtual('isCancellable').get(function () {
    return !['shipped', 'delivered', 'cancelled'].includes(this.orderStatus);
});

orderSchema.virtual('isRefundable').get(function () {
    return this.paymentStatus === 'completed' &&
        ['confirmed', 'processing'].includes(this.orderStatus);
});

/* ---------------- PRE-SAVE: AUTO ORDER NUMBER ---------------- */
orderSchema.pre("save", function (next) {
    if (!this.orderNumber) {
        const shortId = this._id.toString().slice(-6).toUpperCase();
        const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
        this.orderNumber = `ORD-${date}-${shortId}`;
    }

    if (this.orderStatus === 'cancelled' &&
        this.paymentStatus === 'completed' &&
        !this.isModified('paymentStatus')) {
        this.paymentStatus = 'refunded';
    }

    if (this.orderStatus === 'delivered' && this.paymentStatus === 'pending') {
        return next(new Error('Cannot deliver order with pending payment'));
    }

    next();
});

/* ---------------- STATICS ---------------- */
orderSchema.statics.getStatsByUser = async function (userId) {
    return this.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalSpent: {
                    $sum: {
                        $cond: [
                            { $eq: ['$paymentStatus', 'completed'] },
                            '$totalAmount',
                            0
                        ]
                    }
                },
                averageOrderValue: { $avg: '$totalAmount' }
            }
        }
    ]);
};

orderSchema.statics.getRevenueByDateRange = async function (startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                paymentStatus: 'completed'
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                },
                revenue: { $sum: '$totalAmount' },
                orders: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
};

/* ---------------- METHODS ---------------- */
orderSchema.methods.canBeCancelled = function () {
    return !['shipped', 'delivered', 'cancelled'].includes(this.orderStatus);
};

orderSchema.methods.calculateRefundAmount = function () {
    if (this.paymentStatus !== 'completed') return 0;
    if (['confirmed', 'processing'].includes(this.orderStatus)) return this.totalAmount;
    return 0;
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
