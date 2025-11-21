import { apiSlice } from "@/store/apiSlice";


const PRODUCT_URL = '/admin';

export const adminOrderSlice = apiSlice.injectEndpoints({
    
    endpoints:(builder)=>({
         getAllOrders:builder.query({
            query:()=>({
                url:`${PRODUCT_URL}/orders`,
                method:'GET'
            }),
            providesTags:['Order']
        }),
        getOrderAnlytics:builder.query({
            query:()=>({
                url:`${PRODUCT_URL}/order/anlytics`,
                method:'GET'
            }),
            providesTags:['Order']
        }),
        getOrderAnalyticsByDate:builder.query({
            query:()=>({
                url:`${PRODUCT_URL}/order/anlyticsByRange`,
                method:'GET'
            }),
            providesTags:['Order']
        }),
        // createOrder:builder.mutation({
        //     query:(data)=>({
        //         url:`${PRODUCT_URL}/order`,
        //         method:'POST',
        //         body:data
        //     }),
        //     invalidatesTags:['Order']
        // }),   
        
        // updateOrderStatus:builder.mutation({
        //     query: ({ id, ...updates }) => ({
        //         url: `${PRODUCT_URL}/order/${id}/status`,
        //         method: 'PATCH',
        //         body: updates,
        //     }),
        //     invalidatesTags:['Order']
        // }),
        // cancelOrder:builder.mutation({
        //     query:(id)=>({
        //         url:`${PRODUCT_URL}/order/${id}/cancel`,
        //         method:'PATCH'
        //     }),
        //     invalidatesTags:['Order']
        // }),
    })
})

export const{useGetAllOrdersQuery,useGetOrderAnlyticsQuery,useGetOrderAnalyticsByDateQuery} = adminOrderSlice;