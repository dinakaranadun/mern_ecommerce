import { apiSlice } from "../apiSlice";

const AUTH_URL = '/auth';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        login:builder.mutation({
            query:(data)=>({
                url:`${AUTH_URL}/login`,
                method:'POST',
                body:data,
            }),
            
        }),
        signUp:builder.mutation({
            query:(data)=>({
                url:`${AUTH_URL}/`,
                method:'POST',
                body:data,
            }),
        }),
        updateProfile:builder.mutation({
            query:(data)=>({
                url:`${AUTH_URL}/profile`,
                method:'PUT',
                body:data,
            }),
            invalidatesTags: ['User'],
        }),
         getUser:builder.query({
            query:()=>({
                url:`${AUTH_URL}/profile`,
            }),
            providesTags: ['User'],
        }),
        logout:builder.mutation({
            query:()=>({
                url:`${AUTH_URL}/logout`,
                method:'POST',
            }),
            invalidatesTags: ['User'],
        }),
    })
})

export const {useLoginMutation,useLogoutMutation,useGetUserQuery,useSignUpMutation,useUpdateProfileMutation} = authApiSlice;