import asyncHandler from "express-async-handler";
import { sendResponse } from "../../utils/responseMessageHelper.js";
import Product from "../../models/Product.js";



const getFilteredproducts = asyncHandler(async(req,res)=>{
    const {category = [], brand = [], sortBy = "title-atoz"} = req.query;
    
    let sort = {}
    let filters = {};

    if(category.length){
        filters.category = {$in:category.split(',')}
    }

    if(brand.length){
        filters.brand = {$in:brand.split(',')}
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


    const products = await Product.find(filters).sort(sort);

    if(products){
        sendResponse(res,200,true,"Filtred products",products);
    }
    else{
        sendResponse(res,400,false,"Product Fetching Failed");
    }

})

const getProductDetails = asyncHandler(async(req,res)=>{
    const {id} = req.params;

    const product = await Product.findById(id);

    if(!product){
        sendResponse(res,400,false,"No Product Found");
    }

    sendResponse(res,200,true,`Fetched Product ${product.title}`,product);
})

export{getFilteredproducts,getProductDetails};
