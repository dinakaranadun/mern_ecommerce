import { apiSlice } from "../apiSlice";

const PRODUCT_URL = '/user';

export const shippingFeeSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getDistrict:builder.query({
            query:()=>({
                url:`${PRODUCT_URL}/districts`,
                method:'GET',
            })
        }),
        getShippingFee:builder.query({
            query:(district)=>({
                url:`${PRODUCT_URL}/shippingFee/${district}`,
                method:'GET',
            })
        })
    }),
    
})

export const{useGetDistrictQuery,useGetShippingFeeQuery} = shippingFeeSlice;