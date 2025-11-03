import express from 'express'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { addAddress, deleteAddress, editAddress, getAddress, makeDefaultAddress } from '../../controllers/shop/addressController.js';


const addressRouter = express.Router();

addressRouter.get('/address',authMiddleware,getAddress);
addressRouter.patch('/address/:addressId',authMiddleware,makeDefaultAddress);
addressRouter.post('/address',authMiddleware,addAddress);
addressRouter.put('/address/:addressId',authMiddleware,editAddress);
addressRouter.delete('/address/:addressId',authMiddleware,deleteAddress);

export default addressRouter;