import asyncHandler from 'express-async-handler'
import Product from '../../models/Product.js';
import Order from '../../models/Order.js'; // Add this
import { sendResponse } from '../../utils/responseMessageHelper.js';

const reviewManage = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user._id;
  const productId = req.params.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
  }

  const hasPurchased = await Order.exists({
    userId: userId,
    'items.productId': productId,
    orderStatus: { $in: ['delivered', 'completed'] }
  });

  if (!hasPurchased) {
    return res.status(403).json({ 
      success: false, 
      message: "You can only review products you've purchased" 
    });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const existingReviewIndex = product.reviews.findIndex(
    (rev) => rev.user.toString() === userId.toString()
  );

  if (existingReviewIndex !== -1) {
    product.reviews[existingReviewIndex].rating = rating;
    product.reviews[existingReviewIndex].comment = comment || "";
  } else {
    product.reviews.push({ user: userId, rating, comment: comment || "" });
  }

  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length;

  await product.save();

  sendResponse(res, 200, true, 
    existingReviewIndex !== -1 ? "Review updated successfully" : "Review added successfully",
    { rating: product.rating, numReviews: product.numReviews }
  );
});

export { reviewManage };