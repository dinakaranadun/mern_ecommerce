import asyncHandler from 'express-async-handler'
import Product from '../../models/Product.js';
import { sendResponse } from '../../utils/responseMessageHelper.js';

const reviewManage = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user._id;
  const productId = req.params.id;

  const product = await Product.findById(productId);

  if (!product) throw new Error("No product found!");

  product.reviews = product.reviews.filter(
    (rev) => rev.user.toString() !== userId.toString()
  );

  product.reviews.push({ user: userId, rating, comment });

  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
    product.reviews.length;

  await product.save();

  sendResponse(res, 200, true, "Review added/updated successfully");
});


export{reviewManage};