import { apiSlice } from "@/store/apiSlice";


const PRODUCT_URL = '/admin';

export const adminOrderSlice = apiSlice.injectEndpoints({
    
    endpoints:(builder)=>({
         getAllOrders: builder.query({
            query: (params = {}) => {
                const { page = 1, limit = 12 } = params;
                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                });
                
                return {
                    url: `${PRODUCT_URL}/orders?${queryParams.toString()}`,
                    method: 'GET',
                };
            },
            providesTags: ['Order'],
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
        updateOrderStatusAdmin:builder.mutation({
            query:({orderId, orderStatus, trackingNumber, carrier})=>({
                url:`${PRODUCT_URL}/order/${orderId}/updateOrderStatus`,
                method:'PATCH',
                body:{orderStatus, trackingNumber, carrier}
            }),
            invalidatesTags:['Order']
        }),   
        
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

export const{useGetAllOrdersQuery,useGetOrderAnlyticsQuery,useGetOrderAnalyticsByDateQuery,useUpdateOrderStatusAdminMutation} = adminOrderSlice;