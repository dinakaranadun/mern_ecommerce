import { apiSlice } from "../apiSlice";

const PRODUCT_URL = '/user';

export const paymentSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        createPaymentIntent:builder.mutation({
            query:(data)=>({
                url:`${PRODUCT_URL}/payment/create-intent`,
                method:'POST',
                body:data
            })
        })
    }),
})

export const{useCreatePaymentIntentMutation} = paymentSlice;