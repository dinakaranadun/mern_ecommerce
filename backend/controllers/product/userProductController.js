import asyncHandler from "express-async-handler";
import { sendResponse } from "../../utils/responseMessageHelper";
import Product from "../../models/Product";



const getFilteredproducts = asyncHandler(async(req,res)=>{
    const {category = [], brand = [], sortBy = ["title-atoz"]} = req.query;

    let filters = {};

    if(category.length){
        filters.category = {$in:category.split(',')}
    }

    if(brand.length){
        filters.brand = {$in:brand.split(',')}
    }

    let sort = {}

    switch(sortBy){
        case "price-lowtohigh":
            sort.price = 1
            break;
        case "price-hightolow":
            sort.price = -1
            break;
        case "title-atoz":
            sort.title = 1
            break;
        case "title-ztoa":
            sort.title = -1
            break;
        default:
            sort.title = 1
            break;   
    }


})
