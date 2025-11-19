import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
      maxlength: 500, 
      trim: true
    },
    helpfulCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);


reviewSchema.index({ user: 1 });

const productSchema = new mongoose.Schema({
    image: String,
    name: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    stock: Number,
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured:{
        type:Boolean,
        default:false,
    },
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
    if (this.constructor.name === 'Query') {
        this.where({ isDeleted: { $ne: true } });
    }
    next();
});

productSchema.virtual('userReview').get(function() {
  return null; 
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product',productSchema);
export default Product;