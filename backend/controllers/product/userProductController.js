import asyncHandler from "express-async-handler";
import { sendResponse } from "../../utils/responseMessageHelper.js";
import Product from "../../models/Product.js";



const getFilteredproducts = asyncHandler(async(req,res)=>{
    const {
        category = [], 
        brand = [], 
        sortBy = "title-atoz",
        featured = false,
        page = 1,
        limit = 18
    } = req.query;
    
    let sort = {}
    let filters = {};

    if(category.length){
        filters.category = {$in:category.split(',')}
    }

    if(brand.length){
        filters.brand = {$in:brand.split(',')}
    }

    if(featured === 'true' || featured === true){
        filters.featured = true;
    }

    switch(sortBy){
        case "price-lowtohigh":
            sort.price = 1
            break;
        case "price-hightolow":
            sort.price = -1
            break;
        case "title-atoz":
            sort.name = 1
            break;
        case "title-ztoa":
            sort.name = -1
            break;
        default:
            sort.title = 1
            break;   
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(filters);
    
    const products = await Product.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limitNum);

    if(products){
        const totalPages = Math.ceil(totalProducts / limitNum);
        
        sendResponse(res, 200, true, "Filtered products", {
            data: products,
            pagination: {
                currentPage: pageNum,
                totalPages: totalPages,
                totalProducts: totalProducts,
                productsPerPage: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            }
        });
    }
    else{
        sendResponse(res, 400, false, "Product Fetching Failed");
    }
})



const getProductDetails = asyncHandler(async(req,res)=>{
    const {id} = req.params;

    const product = await Product.findById(id).populate(
        'reviews.user','userName'
    ).lean();

    if(!product){
        sendResponse(res,400,false,"No Product Found");
    }

    sendResponse(res,200,true,`Fetched Product ${product.name}`,product);
})

export{getFilteredproducts,getProductDetails};
