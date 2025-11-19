import { apiSlice } from "../apiSlice";


const PRODUCT_URL = '/user';

export const userProductSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProductsWithFilter: builder.query({
            query: ({ filters = {}, sort = null, featured = false}) => {
                const params = {};
                
                Object.entries(filters).forEach(([key, value]) => {
                    if (Array.isArray(value) && value.length > 0) {
                        params[key] = value.join(',');
                    }
                });
                
                if (sort) {
                    params.sortBy = sort;
                }
                if(featured){
                    params.featured = true;
                }
                
                return {
                    url: `${PRODUCT_URL}/products`,
                    method: 'GET',
                    params: params,
                };
            },
            providesTags: ['Products'],
        }),
        getProductDetails: builder.query({
            query: ( id ) => ({
                url: `${PRODUCT_URL}/product/${id}`,
                method: 'GET',
                }),
            }),
        manageReviews:builder.mutation({
            query:({id,rating,comment})=>({
                url:`${PRODUCT_URL}/product/review/${id}`,
                method:'POST',
                body:{rating,comment}
            }),
            invalidatesTags:['Order']
        })       
        }),
        
})

export const { useGetProductsWithFilterQuery,useGetProductDetailsQuery,useManageReviewsMutation } = userProductSlice;