import { apiSlice } from "@/store/apiSlice";

const PRODUCT_URL = '/admin';

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: `${PRODUCT_URL}/products`,
            }),
            providesTags: ['Products'],
        }),

        addProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCT_URL}/products`, 
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),

        updateProduct: builder.mutation({
            query: ({ id, ...data }) => ({ 
                url: `${PRODUCT_URL}/products/${id}`, 
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({ 
                url: `${PRODUCT_URL}/products/${id}`, 
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),
    }),
});

export const { useGetProductsQuery,useAddProductMutation,useUpdateProductMutation,useDeleteProductMutation} = productApiSlice;