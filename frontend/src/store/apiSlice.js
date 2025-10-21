/* eslint-disable no-unused-vars */
// @ts-nocheck
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api', 
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/v1',
    credentials: 'include',
  }),
  tagTypes: ['User','Products','Cart'], 
  // @ts-ignore
  endpoints: (builder) => ({}), 
});
