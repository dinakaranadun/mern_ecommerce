import ShippingFee from "../../models/ShippingFee.js";
import { sendResponse } from '../../utils/responseMessageHelper.js';
import asyncHandler from 'express-async-handler';

const getAllDistricts = asyncHandler(async (req, res) => {
  const districts = await ShippingFee.find({ isActive: true })
    .select('district province')
    .sort({  district: 1 });

  sendResponse(res, 200, true, 'Districts Fetched', districts);
});

const getShippingByDistrict = asyncHandler(async (req, res) => {
  const { district } = req.params;
  
  const shippingInfo = await ShippingFee.findOne({
    district: { $regex: `^${district.trim()}$`, $options: 'i' },
    isActive: true
  })
  .select('baseFee')
  .lean();

  if (!shippingInfo) {
    sendResponse(res, 404, false, 'Error Occured Fetching Data');
    return;
  }

  sendResponse(res, 200, true, `Shipping Cost for ${district}`, shippingInfo);
});

export { getAllDistricts, getShippingByDistrict };
