import  asyncHandler from 'express-async-handler';
import Product from '../../models/Product.js';
import { sendResponse } from '../../utils/responseMessageHelper.js';
import Cart from '../../models/Cart.js';
import mongoose from 'mongoose';



const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return sendResponse(res, 400, false, 'Invalid product ID');
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        return sendResponse(res, 400, false, 'Quantity must be a positive integer');
    }

    // Check product exists and has stock
    const product = await Product.findById(productId).select('stock');
    
    if (!product) {
        return sendResponse(res, 404, false, 'Product not found');
    }

    if (product.stock < quantity) {
        return sendResponse(res, 400, false, `Only ${product.stock} items available in stock`);
    }

    let cart = await Cart.findOneAndUpdate(
        { 
            userId, 
            'items.productId': productId 
        },
        { 
            $inc: { 'items.$.quantity': quantity },
            $set: { updatedAt: Date.now() }
        },
        { 
            new: true,
            runValidators: true
        }
    ).populate('items.productId', 'name price salePrice image stock');

    // If product not in cart
    if (!cart) {
        cart = await Cart.findOneAndUpdate(
            { userId },
            {
                $push: { 
                    items: { 
                        productId, 
                        quantity 
                    } 
                },
                $set: { updatedAt: Date.now() }
            },
            { 
                new: true, 
                upsert: true,
                runValidators: true
            }
        ).populate('items.productId', 'name price salePrice image stock');
    }

    // Validate total quantity doesn't exceed stock
    const cartItem = cart.items.find(
        item => item.productId._id.toString() === productId.toString()
    );

    if (cartItem && cartItem.quantity > product.stock) {
        cartItem.quantity = product.stock;
        await cart.save();
        
        return sendResponse(
            res, 
            200, 
            true, 
            `Adjusted quantity to maximum available stock (${product.stock})`, 
            cart
        );
    }

    return sendResponse(res, 200, true, 'Item added to cart successfully', cart);
});

const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id })
        .populate('items.productId', 'image name salePrice price  stock');

    if (!cart || cart.items.length === 0) {
        return sendResponse(
            res, 
            200, 
            true, 
            'Cart is empty', 
            { items: [], totalItems: 0 }
        );
    }

    // product no longer exists
    cart.items = cart.items.filter(item => item.productId !== null);

    return sendResponse(res, 200, true, 'Cart retrieved successfully', cart);
});

const updateCartItem = asyncHandler(async (req, res) => {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
        return sendResponse(res, 400, false, 'Invalid cart item ID');
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
        return sendResponse(res, 400, false, 'Quantity must be a non-negative integer');
    }

    // First, verify the cart exists and get the product ID
    const cart = await Cart.findOne({ userId, "items._id": cartItemId });
    if (!cart) return sendResponse(res, 404, false, 'Cart item not found');

    const cartItem = cart.items.id(cartItemId);
    const productId = cartItem.productId;

    // If quantity is 0, remove item atomically
    if (quantity === 0) {
        const updatedCart = await Cart.findOneAndUpdate(
            { userId, "items._id": cartItemId },
            { 
                $pull: { items: { _id: cartItemId } },
                $set: { updatedAt: Date.now() }
            },
            { new: true }
        ).populate('items.productId', 'name price salePrice image stock');

        if (!updatedCart) return sendResponse(res, 404, false, 'Cart item not found');
        return sendResponse(res, 200, true, 'Item removed from cart', updatedCart);
    }

    // Check product stock
    const product = await Product.findById(productId).select('stock');
    if (!product) return sendResponse(res, 404, false, 'Product not found');

    if (product.stock < quantity) {
        return sendResponse(res, 400, false, `Only ${product.stock} items available in stock`);
    }

    // Update quantity atomically
    const updatedCart = await Cart.findOneAndUpdate(
        { userId, "items._id": cartItemId },
        { 
            $set: { 
                "items.$.quantity": quantity,
                updatedAt: Date.now()
            }
        },
        { new: true }
    ).populate('items.productId', 'name price salePrice image stock');

    if (!updatedCart) return sendResponse(res, 404, false, 'Cart item not found');
    
    return sendResponse(res, 200, true, 'Cart updated successfully', updatedCart);
});

const deleteCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { cartItemId } = req.params; 

  if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
    return sendResponse(res, 400, false, 'Invalid cart item ID');
  }

  
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { 
      $pull: { items: { _id: cartItemId } },
      $set: { updatedAt: Date.now() }
    },
    { new: true }
  ).populate('items.productId', 'name price salePrice image stock');

  if (!cart) {
    return sendResponse(res, 404, false, 'Item not found in cart');
  }

  return sendResponse(res, 200, true, 'Item removed successfully', cart);
});

const clearCartItems = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    if(!userId){
        throw new Error('Invalid User');
    }

    const clearedCart = await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [], updatedAt: Date.now() } },
        { new: true }
    );

    if (!clearedCart) {
        return sendResponse(res, 404, false, 'Cart not found');
    }

    return sendResponse(res, 200, true, 'All items cleared from cart');

})


export {addToCart,getCart,updateCartItem,deleteCartItem,clearCartItems};