import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { addToCart, deleteCartitems, getCart, updateCartItem } from '../../controllers/shop/cartController.js';


const cartRouter = express.Router();


cartRouter.post('/cart',authMiddleware,addToCart);
cartRouter.get('/cart',authMiddleware,getCart);
cartRouter.put('/cart/:productId',authMiddleware,updateCartItem);
cartRouter.delete('/cart/:productId',authMiddleware,deleteCartitems);

export default cartRouter;