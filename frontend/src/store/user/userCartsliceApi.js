import { apiSlice } from "../apiSlice";

const PRODUCT_URL = '/user';

export const userCartSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getCart:builder.query({
            query:() =>({
                url:`${PRODUCT_URL}/cart`,
                method:'GET'
            }),
            providesTags:['Cart'],
        }),
        addToCart:builder.mutation({
            query:(data)=>({
                url:`${PRODUCT_URL}/cart`,
                method:'POST',
                body:data
            }),
            invalidatesTags:['Cart'],
        }),

        updateCart:builder.mutation({
            query:(productId) => ({
                url:`${PRODUCT_URL}/cart/${productId}`,
                method:'PUT'
            }),
            invalidatesTags:['Cart'],
        }),
        deleteProduct:builder.mutation({
            query:(productId)=>({
                url:`${PRODUCT_URL}/cart/${productId}`,
                method:'DELETE'
            }),
            invalidatesTags:['Cart']
        }),
    }),
});


export const {useGetCartQuery,useAddToCartMutation,useUpdateCartMutation,useDeleteProductMutation} = userCartSlice;