import { apiSlice } from "../apiSlice";

const PRODUCT_URL = '/user';

export const paymentSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        createPaymentIntent:builder.mutation({
            query:({amount})=>({
                url:`${PRODUCT_URL}/payment/create-intent`,
                method:'POST',
                body:amount
            })
        })
    }),
})

export const{useCreatePaymentIntentMutation} = paymentSlice;