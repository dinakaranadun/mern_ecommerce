import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { getFilteredproducts, getProductDetails } from '../../controllers/product/userProductController.js';



const userProductRouter = express.Router();


userProductRouter.get('/products',authMiddleware,getFilteredproducts);
userProductRouter.get('/product/:id',authMiddleware,getProductDetails)

export default userProductRouter;