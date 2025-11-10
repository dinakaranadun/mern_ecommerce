import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { getAllDistricts, getShippingByDistrict } from '../../controllers/shop/shippingController.js';



const shippingFeeRouter = express.Router();

shippingFeeRouter.get('/districts',authMiddleware,getAllDistricts);
shippingFeeRouter.get('/shippingFee/:district',authMiddleware,getShippingByDistrict);

export default shippingFeeRouter;