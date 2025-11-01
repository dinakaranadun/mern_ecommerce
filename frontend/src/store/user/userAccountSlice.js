import { apiSlice } from "../apiSlice";

const PRODUCT_URL = '/user';

export const userAccountSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getAddress:builder.query({
            query:()=>({
                url:`${PRODUCT_URL}/address`,
                method:'GET'
            }),
            providesTags:['Address']
        }),
        makeIdDefault:builder.mutation({
            query:(addressId)=>({
                url:`${PRODUCT_URL}/address/${addressId}`,
                method:'PATCH'
            }),
            invalidatesTags:['Address']
        }),
        addAddress:builder.mutation({
            query:(data)=>({
                url:`${PRODUCT_URL}/address`,
                method:'POST',
                body:data
            }),
            invalidatesTags:['Address']
        }),
        editAddress: builder.mutation({
            query: ({ addressId, formData }) => ({
                url: `${PRODUCT_URL}/address/${addressId}`,  // Make sure addressId is a string
                method: 'PUT',
                body: formData
            }),
            invalidatesTags: ['Address']
        }),
        deleteAddress:builder.mutation({
            query:(addressId)=>({
                url:`${PRODUCT_URL}/address/${addressId}`,
                method:'DELETE',
            }),
            invalidatesTags:['Address']
        }),

    })
})

export const {useGetAddressQuery,useMakeIdDefaultMutation,useAddAddressMutation,useEditAddressMutation,useDeleteAddressMutation} = userAccountSlice;