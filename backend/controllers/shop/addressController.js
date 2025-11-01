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

  // Validate type
  if (type && !['home', 'work'].includes(type)) {
    return sendResponse(res, 400, false, "Address type must be either 'home' or 'work'");
  }

  // Check if address of this type already exists
  const existingAddress = await UserAddress.findOne({ userId, type: type || "home" });
  
  if (existingAddress) {
    return sendResponse(res, 400, false, `You already have a ${type || "home"} address. Only one ${type || "home"} address is allowed.`);
  }

  const newAddress = await UserAddress.create({
    userId,
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
   const { phone, line1, line2, city, province, postalCode, country, type, isDefault } = req.body;

   if(!userId){
      return sendResponse(res,400,false,"Invalid User")
   }
   if(!addressId){
      return sendResponse(res,400,false,"Invalid Address")
   }

   if (type && !['home', 'work'].includes(type)) {
      return sendResponse(res, 400, false, "Address type must be either 'home' or 'work'");
   }

   const address = await UserAddress.findOne({ _id: addressId, userId });

   if (!address) {
      return sendResponse(res, 404, false, "Address not found");
   }

   if (type && type !== address.type) {
      const existingAddress = await UserAddress.findOne({ 
         userId, 
         type,
         _id: { $ne: addressId } 
      });
      
      if (existingAddress) {
         return sendResponse(res, 400, false, `You already have a ${type} address. Only one ${type} address is allowed.`);
      }
   }

   if (phone && !/^\d{10}$/.test(phone)) {
      return sendResponse(res, 400, false, "Phone number must be 10 digits");
   }

   if (type) address.type = type;
   if (line1) address.line1 = line1;
   if (line2 !== undefined) address.line2 = line2;
   if (city) address.city = city;
   if (province) address.province = province;
   if (postalCode) address.postalCode = postalCode;
   if (country) address.country = country;
   if (phone) address.phone = phone;
   if (isDefault !== undefined) address.isDefault = isDefault;

   await address.save();

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
       return sendResponse(res, 400, false, "Failed to delete address. Try again later.");
   }

   sendResponse(res, 200, true, "Address deleted successfully");
   
});

const makeDefaultAddress = asyncHandler(async(req, res) => {
   const { addressId } = req.params;
   const userId = req.user._id;

   if (!addressId) {
      return sendResponse(res, 400, false, "Invalid Address");
   }

   const address = await UserAddress.findOne({ 
      _id: addressId, 
      userId 
   });

   if (!address) {
      return sendResponse(res, 404, false, "Address not found or unauthorized");
   }

   await UserAddress.bulkWrite([
      {
         updateMany: {
            filter: { userId: userId },
            update: { $set: { isDefault: false } }
         }
      },
      {
         updateOne: {
            filter: { _id: addressId },
            update: { $set: { isDefault: true } }
         }
      }
   ]);

   const updatedAddress = await UserAddress.findById(addressId);

   sendResponse(res, 200, true, "Default address set", updatedAddress);
});

export {getAddress,addAddress,editAddress,deleteAddress,makeDefaultAddress};