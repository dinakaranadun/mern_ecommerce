import express from 'express'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { addAddress, getAddress, makeDefaultAddress } from '../../controllers/shop/addressController.js';


const addressRouter = express.Router();

addressRouter.get('/address',authMiddleware,getAddress);
addressRouter.get('/address/:addressId',authMiddleware,makeDefaultAddress);
addressRouter.post('/address',authMiddleware,addAddress);
addAddress.put('/address/:addressId',authMiddleware);
addAddress.delete('/address/addressId',authMiddleware);

export default addressRouter;