import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { getFilteredproducts, getProductDetails } from '../../controllers/product/userProductController.js';
import { reviewManage } from '../../controllers/product/productRatingController.js';



const userProductRouter = express.Router();


userProductRouter.get('/products',authMiddleware,getFilteredproducts);
userProductRouter.get('/product/:id',authMiddleware,getProductDetails);
userProductRouter.post('/product/review/:id',authMiddleware,reviewManage);

export default userProductRouter;