import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Category', 'Sale', 'User', 'Expense', 'InventoryAlert'],
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query({
      query: (params = {}) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    
    // Categories
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation({
      query: (category) => ({
        url: '/categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['Category'],
    }),
    
    // Sales
    getSales: builder.query({
      query: (params = {}) => ({
        url: '/sales',
        params,
      }),
      providesTags: ['Sale'],
    }),
    createSale: builder.mutation({
      query: (sale) => ({
        url: '/sales',
        method: 'POST',
        body: sale,
      }),
      invalidatesTags: ['Sale', 'Product'],
    }),
    
    // Users
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
    
    // Expenses
    getExpenses: builder.query({
      query: (params = {}) => ({
        url: '/expenses',
        params,
      }),
      providesTags: ['Expense'],
    }),
    createExpense: builder.mutation({
      query: (expense) => ({
        url: '/expenses',
        method: 'POST',
        body: expense,
      }),
      invalidatesTags: ['Expense'],
    }),
    
    // Inventory Alerts
    getInventoryAlerts: builder.query({
      query: () => '/inventory/alerts',
      providesTags: ['InventoryAlert'],
    }),
    markAlertAsRead: builder.mutation({
      query: (id) => ({
        url: `/inventory/alerts/${id}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['InventoryAlert'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useGetSalesQuery,
  useCreateSaleMutation,
  useGetUsersQuery,
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useGetInventoryAlertsQuery,
  useMarkAlertAsReadMutation,
} = apiSlice;