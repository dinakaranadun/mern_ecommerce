import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { addToCart, clearCartItems, deleteCartItem, getCart, updateCartItem } from '../../controllers/shop/cartController.js';


const cartRouter = express.Router();


cartRouter.post('/cart',authMiddleware,addToCart);
cartRouter.get('/cart',authMiddleware,getCart);
cartRouter.put('/cart/:cartItemId',authMiddleware,updateCartItem);
cartRouter.post('/cart/clear',authMiddleware,clearCartItems);
cartRouter.delete('/cart/:cartItemId',authMiddleware,deleteCartItem);

export default cartRouter;