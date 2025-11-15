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
            query:({cartItemId,quantity}) => ({
                url:`${PRODUCT_URL}/cart/${cartItemId}`,
                method:'PUT',
                body:{ quantity }
            }),
            invalidatesTags:['Cart'],
        }),
        clearCart:builder.mutation({
            query:() => ({
                url:`${PRODUCT_URL}/cart/clear`,
                method:'POST',
            }),
            invalidatesTags:['Cart'],
        }),
        removeProduct:builder.mutation({
            query:(cartId)=>({
                url:`${PRODUCT_URL}/cart/${cartId}`,
                method:'DELETE'
            }),
            invalidatesTags:['Cart']
        }),
    }),
});


export const {useGetCartQuery,useAddToCartMutation,useUpdateCartMutation,useClearCartMutation,useRemoveProductMutation} = userCartSlice;