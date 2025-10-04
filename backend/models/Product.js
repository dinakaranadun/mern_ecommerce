import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    image: String,
    name: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    stock: Number,
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }

},{timestamps:true})


//exclude soft deleted from queries
productSchema.pre(/^find/, function(next) {
    if (!this.getUpdate) {
        this.find({ isDeleted: { $ne: true } });
    }
    next();
});

const Product = mongoose.model('Product',productSchema);
export default Product;