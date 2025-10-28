import asyncHandler from 'express-async-handler'
import UserAddress from '../../models/Address.js';
import { sendResponse } from '../../utils/responseMessageHelper.js';




const getAddress = asyncHandler(async(req,res)=>{
   const userId = req.user._id;

   if(!userId){
      return sendResponse(res,400,false,"invalid User")
   }

   const data = await UserAddress.find({userId})

   sendResponse(res,200,true,"User addresses",data);
})


 const addAddress = asyncHandler(async (req, res) => {
  const { phone, line1, line2, city, province, postalCode, country, type, isDefault } = req.body;
  const userId = req.user._id;

  if (!phone || !line1 || !city || !province || !postalCode) {
    return sendResponse(res, 400, false, "Missing required address fields");
  }

  if (!/^\d{10}$/.test(phone)) {
    return sendResponse(res, 400, false, "Phone number must be 10 digits");
  }

  const newAddress = await UserAddress.create({
    user: userId,
    line1,
    line2,
    city,
    province,
    postalCode,
    country: country || "Sri Lanka",
    phone,
    type: type || "home",
    isDefault: !!isDefault,
  });

  if (!newAddress) {
    return sendResponse(res, 400, false, "Failed to add new address. Try again later.");
  }

  sendResponse(res, 201, true, "Address added successfully", newAddress);
});


const editAddress = asyncHandler(async(req,res)=>{
   const {addressId} = req.params;
   const userId = req.user._id;
   const data = req.body;

   if(!userId){
      return sendResponse(res,400,false,"Invalid User")
   }
   if(!addressId){
      return sendResponse(res,400,false,"Invalid Address")
   }

   const address = await UserAddress.findOneAndUpdate({
      _id:addressId,userId
   },data,{new:true});

   if(!address){
       return sendResponse(res, 400, false, "Failed to update address. Try again later.");
   }

   sendResponse(res, 200, true, "Address updated successfully", address);

});

const deleteAddress = asyncHandler(async(req,res)=>{
   const {addressId} = req.params;
   const userId = req.user._id;

   if(!userId){
      return sendResponse(res,400,false,"Invalid User")
   }
   if(!addressId){
      return sendResponse(res,400,false,"Invalid Address")
   }

   const address = await UserAddress.findOneAndDelete({
      _id:addressId,userId
   });

   if(!address){
       return sendResponse(res, 400, false, "Failed to update address. Try again later.");
   }

   sendResponse(res, 200, true, "Address deleted successfully");
   
});

const makeDefaultAddress = asyncHandler(async(req,res)=>{
   const {addressId} = req.params;
   const userId = req.user._id;

   if(!userId){
      return sendResponse(res,400,false,"Invalid User")
   }
   if(!addressId){
      return sendResponse(res,400,false,"Invalid Address")
   }

   const address = await UserAddress.findById(addressId);

   await UserAddress.updateMany({ user:userId }, { $set: { isDefault: false } });
   address.isDefault = true;
   await address.save();

   sendResponse(res, 200, true, "Default address set", address);

});

export {getAddress,addAddress,editAddress,deleteAddress,makeDefaultAddress};