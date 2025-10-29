import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/features/api/apiSlice';
import authSlice from '@/features/auth/authSlice';
import inventorySlice from '@/features/inventory/inventorySlice';
import posSlice from '@/features/pos/posSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    inventory: inventorySlice,
    pos: posSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;