import asyncHandler from "express-async-handler";
import { sendResponse } from "../../utils/responseMessageHelper.js";
import { imageUploadUtil } from "../../config/cloudinary.js";
import Product from "../../models/Product.js";

//save image on cloudinary and send url data
const handleimageUpload = asyncHandler(async(req,res)=>{
    
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const url = `data:${req.file.mimetype};base64,${b64}`;
        const result = await imageUploadUtil(url);

        sendResponse(res,200,true,"success",result)    
})

//add new product 
const addNewProduct = asyncHandler(async(req, res) => {
    const { image, name, description, category, brand, price, salePrice, stock } = req.body;
    
    if (!name || !price || !category) {
        return sendResponse(res, 400, false, "Please provide all required fields");
    }

    const productExists = await Product.findOne({ name });
    if (productExists) {
        return sendResponse(res, 400, false, "Product already exists");
    }

    const product = await Product.create({
        image,
        name,
        description,
        category,
        brand,
        price,
        salePrice,
        stock: stock || 0
    });

    sendResponse(res, 201, true, "Product added successfully", {
        _id: product._id,
        name: product.name,
        price: product.price,
        category: product.category
    });
});

//edit product
const editProduct = asyncHandler(async(req, res) => {
    const { image, name, description, category, brand, price, salePrice, stock } = req.body;
    
    // Get ID from URL params instead of req.product
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return sendResponse(res, 404, false, "Product not found");
    }

    // ... rest of your validation logic ...

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    product.price = price ?? product.price;
    product.salePrice = salePrice ?? product.salePrice;
    product.stock = stock ?? product.stock;
    product.image = image ?? product.image;

    const updatedProduct = await product.save();
    
    sendResponse(res, 200, true, "Product updated successfully", {
        _id: updatedProduct._id,
        name: updatedProduct.name,
        price: updatedProduct.price,
        salePrice: updatedProduct.salePrice,
        stock: updatedProduct.stock,
        category: updatedProduct.category
    });
});

//get all products in the db with pagination and backend filtering

const fetchAllProducts = asyncHandler(async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Backend filters (for large datasets)
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.brand) filter.brand = req.query.brand;
    
    const products = await Product.find(filter)
        .limit(limit)
        .skip(skip);
    
    const total = await Product.countDocuments(filter);

    sendResponse(res, 200, true, "Products fetched successfully", {
        products,
        pagination: { page, limit, total },
        filterOptions: {
            categories: await Product.distinct('category'),
            brands: await Product.distinct('brand')
        }
    });
});

//delete product

const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return sendResponse(res, 404, false, "Product not found");
    }

    if (product.isDeleted) {
        return sendResponse(res, 400, false, "Product is already deleted");
    }

    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save();
    
    sendResponse(res, 200, true, "Product deleted successfully", {
        _id: product._id,
        name: product.name
    });
});

export {handleimageUpload,addNewProduct,editProduct,fetchAllProducts,deleteProduct};