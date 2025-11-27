import { apiSlice } from "@/store/apiSlice";

const PRODUCT_URL = '/admin';

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params = {}) => {
                const { page = 1, limit = 12, category, brand } = params;
                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                });
                
                if (category && category !== 'all') {
                    queryParams.append('category', category);
                }
                if (brand && brand !== 'all') {
                    queryParams.append('brand', brand);
                }
                
                return {
                    url: `${PRODUCT_URL}/products?${queryParams.toString()}`,
                };
            },
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

export const { useGetProductsQuery, useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation } = productApiSlice;