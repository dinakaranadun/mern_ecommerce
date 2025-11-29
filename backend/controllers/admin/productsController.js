import asyncHandler from "express-async-handler";
import { sendResponse } from "../../utils/responseMessageHelper.js";
import { imageUploadUtil } from "../../config/cloudinary.js";
import Product from "../../models/Product.js";
import sharp from 'sharp';


const handleImageUpload = asyncHandler(async (req, res) => {
    if (!req.file) {
        return sendResponse(res, 400, false, "No file uploaded");
    }

    const { buffer, mimetype, size } = req.file;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(mimetype)) {
        throw new Error('Invalid file type only jpeg,png and webp allowed');
    }

    if (size > 10 * 1024 * 1024) {
        return sendResponse(res, 400, false, "File too large. Maximum 10MB");
    }

    try {
        const MIN_SIZE_FOR_OPTIMIZATION = 50 * 1024; 
        let finalBuffer = buffer;
        let wasOptimized = false;

        if (size > MIN_SIZE_FOR_OPTIMIZATION) {
            const optimizedBuffer = await sharp(buffer)
                .resize(1200, 1200, { 
                    fit: 'inside', 
                    withoutEnlargement: true 
                })
                .rotate() 
                .jpeg({ quality: 85, progressive: true, mozjpeg: true })
                .toBuffer();

            if (optimizedBuffer.length < size) {
                finalBuffer = optimizedBuffer;
                wasOptimized = true;
            }
        }

        // Convert to base64
        const b64 = finalBuffer.toString('base64');
        const mimeType = wasOptimized ? 'image/jpeg' : mimetype;
        const dataUrl = `data:${mimeType};base64,${b64}`;

        // Upload to Cloudinary
        const result = await imageUploadUtil(dataUrl);

        sendResponse(res, 200, true, "Image uploaded successfully", {
            url: result.url,
            publicId: result.public_id,
            originalSize: `${(size / 1024).toFixed(2)} KB`,
            finalSize: `${(finalBuffer.length / 1024).toFixed(2)} KB`,
            optimized: wasOptimized,
            savedSpace: wasOptimized ? `${((1 - finalBuffer.length / size) * 100).toFixed(1)}%` : '0%'
        });
    } catch (error) {
        console.error('Image upload error:', error);
        return sendResponse(res, 500, false, "Image upload failed");
    }
});


const addNewProduct = asyncHandler(async (req, res) => {
    const { image, name, description, category, brand, price, salePrice, stock } = req.body;
    
    // Enhanced validation
    if (!name?.trim() || !price || !category?.trim()) {
        return sendResponse(res, 400, false, "Name, price, and category are required");
    }

    if (price <= 0) {
        return sendResponse(res, 400, false, "Price must be greater than 0");
    }

    if (salePrice && salePrice >= price) {
        return sendResponse(res, 400, false, "Sale price must be less than regular price");
    }

    const productExists = await Product.findOne({ 
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });
    
    if (productExists) {
        return sendResponse(res, 400, false, "Product already exists");
    }

    const product = await Product.create({
        image: image || null,
        name: name.trim(),
        description: description?.trim() || "",
        category: category.trim(),
        brand: brand?.trim() || "",
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        stock: stock ? Number(stock) : 0
    });

    sendResponse(res, 201, true, "Product added successfully", {
        _id: product._id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        category: product.category,
        stock: product.stock,
        image: product.image
    });
});


const editProduct = asyncHandler(async (req, res) => {
    const { image, name, description, category, brand, price, salePrice, stock } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return sendResponse(res, 404, false, "Product not found");
    }

    if (product.isDeleted) {
        return sendResponse(res, 400, false, "Cannot edit deleted product");
    }

    if (price !== undefined && price <= 0) {
        return sendResponse(res, 400, false, "Price must be greater than 0");
    }

    const newPrice = price ?? product.price;
    if (salePrice !== undefined && salePrice >= newPrice) {
        return sendResponse(res, 400, false, "Sale price must be less than regular price");
    }

    if (name && name.trim() !== product.name) {
        const duplicate = await Product.findOne({ 
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
            _id: { $ne: req.params.id }
        });
        
        if (duplicate) {
            return sendResponse(res, 400, false, "Product name already exists");
        }
    }

    if (name) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (category) product.category = category.trim();
    if (brand !== undefined) product.brand = brand.trim();
    if (price !== undefined) product.price = Number(price);
    if (salePrice !== undefined) product.salePrice = salePrice ? Number(salePrice) : null;
    if (stock !== undefined) product.stock = Number(stock);
    if (image !== undefined) product.image = image;

    const updatedProduct = await product.save();
    
    sendResponse(res, 200, true, "Product updated successfully", {
        _id: updatedProduct._id,
        name: updatedProduct.name,
        price: updatedProduct.price,
        salePrice: updatedProduct.salePrice,
        stock: updatedProduct.stock,
        category: updatedProduct.category,
        image: updatedProduct.image
    });
});


const fetchAllProducts = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = { isDeleted: { $ne: true } };
    
    if (req.query.category) {
        filter.category = req.query.category;
    }
    
    if (req.query.brand) {
        filter.brand = req.query.brand;
    }

    // Search functionality
    if (req.query.search) {
        filter.$or = [
            { name: { $regex: req.query.search, $options: 'i' } },
            { description: { $regex: req.query.search, $options: 'i' } }
        ];
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // Stock filter
    if (req.query.inStock === 'true') {
        filter.stock = { $gt: 0 };
    } else if (req.query.inStock === 'false') {
        filter.stock = { $lte: 0 };
    }

    // Sorting
    let sort = {};
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    
    if (['name', 'price', 'stock', 'createdAt'].includes(sortBy)) {
        sort[sortBy] = order;
    } else {
        sort.createdAt = -1;
    }

    // Execute queries in parallel for better performance
    const [products, total, categories, brands] = await Promise.all([
        Product.find(filter)
            .select('-__v -isDeleted -deletedAt') 
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .lean(), 
        Product.countDocuments(filter),
        Product.distinct('category', { isDeleted: { $ne: true } }),
        Product.distinct('brand', { isDeleted: { $ne: true } })
    ]);

    const totalPages = Math.ceil(total / limit);

    sendResponse(res, 200, true, "Products fetched successfully", {
        products,
        pagination: { 
            page, 
            limit, 
            total, 
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        },
        filterOptions: {
            categories: categories.filter(Boolean).sort(),
            brands: brands.filter(Boolean).sort()
        }
    });
});


const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ 
        _id: req.params.id,
        isDeleted: { $ne: true }
    }).lean();
    
    if (!product) {
        return sendResponse(res, 404, false, "Product not found");
    }

    sendResponse(res, 200, true, "Product fetched successfully", product);
});


const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return sendResponse(res, 404, false, "Product not found");
    }

    if (product.isDeleted) {
        return sendResponse(res, 400, false, "Product is already deleted");
    }

    // Soft delete
    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save();
    
    sendResponse(res, 200, true, "Product deleted successfully", {
        _id: product._id,
        name: product.name
    });
});

const bulkUpdateStock = asyncHandler(async (req, res) => {
    const { updates } = req.body; // [{ productId, stock }]
    
    if (!Array.isArray(updates) || updates.length === 0) {
        return sendResponse(res, 400, false, "Invalid updates array");
    }

    const bulkOps = updates.map(({ productId, stock }) => ({
        updateOne: {
            filter: { _id: productId, isDeleted: { $ne: true } },
            update: { $set: { stock: Number(stock) } }
        }
    }));

    const result = await Product.bulkWrite(bulkOps);

    sendResponse(res, 200, true, "Stock updated successfully", {
        modifiedCount: result.modifiedCount
    });
});


const getProductStats = asyncHandler(async (req, res) => {
    const [stats] = await Product.aggregate([
        { $match: { isDeleted: { $ne: true } } },
        {
            $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalStock: { $sum: '$stock' },
                avgPrice: { $avg: '$price' },
                lowStockProducts: {
                    $sum: { $cond: [{ $lte: ['$stock', 10] }, 1, 0] }
                },
                outOfStockProducts: {
                    $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] }
                }
            }
        }
    ]);

    const categoryStats = await Product.aggregate([
        { $match: { isDeleted: { $ne: true } } },
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
                totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
            }
        },
        { $sort: { count: -1 } }
    ]);

    sendResponse(res, 200, true, "Stats fetched successfully", {
        overview: stats || {},
        categoryBreakdown: categoryStats
    });
});

export {
    handleImageUpload,
    addNewProduct,
    editProduct,
    fetchAllProducts,
    getProductById,
    deleteProduct,
    bulkUpdateStock,
    getProductStats
};