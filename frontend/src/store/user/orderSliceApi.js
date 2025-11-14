import { apiSlice } from "../apiSlice";

const PRODUCT_URL = '/user';

export const userOrderSlice = apiSlice.injectEndpoints({
    
    endpoints:(builder)=>({
         getOrders:builder.query({
            query:()=>({
                url:`${PRODUCT_URL}/orders`,
                method:'GET'
            }),
            providesTags:['Order']
        }),
        getOrder:builder.query({
            query:(id)=>({
                url:`${PRODUCT_URL}/order/${id}`,
                method:'GET'
            }),
            providesTags:['Order']
        }),
        getOrderStat:builder.query({
            query:()=>({
                url:`${PRODUCT_URL}/order/stats`,
                method:'GET'
            }),
            providesTags:['Order']
        }),
        createOrder:builder.mutation({
            query:(data)=>({
                url:`${PRODUCT_URL}/order`,
                method:'POST',
                body:data
            }),
            invalidatesTags:['Order']
        }),   
        
        updateOrderStatus:builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `${PRODUCT_URL}/order/${id}/status`,
                method: 'PATCH',
                body: updates,
            }),
            invalidatesTags:['Order']
        }),
        cancelOrder:builder.mutation({
            query:(id)=>({
                url:`${PRODUCT_URL}/order/${id}/cancel`,
                method:'PATCH'
            }),
            invalidatesTags:['Order']
        }),
    })
})

export const{useGetOrderQuery,useGetOrdersQuery,useGetOrderStatQuery,useCreateOrderMutation,useCancelOrderMutation,useUpdateOrderStatusMutation} = userOrderSlice;