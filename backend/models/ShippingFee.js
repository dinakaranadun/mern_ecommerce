import mongoose from "mongoose";

const shippingFeeSchema = new mongoose.Schema({
    district: {
        type: String,
        required: true,
        trim: true
    },
    province: {
        type: String,
        required: true,
        enum: ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa']
    },
    postalCodeRanges: [{
        start: {
        type: Number,
        required: true
        },
        end: {
        type: Number,
        required: true
        }
    }],
    baseFee: {
        type: Number,
        required: true,
        min: 0
    },
    perKgFee: {
        type: Number,
        required: true,
        min: 0
    },
    estimatedDays: {
        min: Number,
        max: Number
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
  timestamps: true
});

shippingFeeSchema.index({ district: 1 });
shippingFeeSchema.index({ 'postalCodeRanges.start': 1, 'postalCodeRanges.end': 1 });

const ShippingFee =  mongoose.model('ShippingFee', shippingFeeSchema);
export default ShippingFee;