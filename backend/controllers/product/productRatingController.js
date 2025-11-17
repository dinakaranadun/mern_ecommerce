import asyncHandler from 'express-async-handler'
import Product from '../../models/Product';

const reviewManage = asyncHandler(async(req,res)=>{
    const {rating,comment} = req.body;
    const userId = req.user._id;
    const productId = req.params.id;

    if(!userId || !productId || !rating){
        return new Error('Please fill necessary details');
    }

    const product = await Product.findById(productId);

    if(!product){
        return new Error('No product Found!')
    }

    const existingReview = product.reviews.find(
    (rev) => rev.user.toString() === userId
  );

  if(existingReview){
    existingReview.rating = rating;
    existingReview.comment = comment;
  }
  else{
     product.reviews.push({
      user: req.user._id,
      rating,
      comment,
    });
  }

  product.numReviews = product.reviews.length;

  product.rating = product.reviews.reduce((acc,review)=> acc+review.rating,0)/product.reviews.length;

  await product.save();
})

export{reviewManage};