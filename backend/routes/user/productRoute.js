import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { getFilteredproducts } from '../../controllers/product/userProductController.js';



const userProductRouter = express.Router();


userProductRouter.get('/products',authMiddleware,getFilteredproducts);


export default userProductRouter;