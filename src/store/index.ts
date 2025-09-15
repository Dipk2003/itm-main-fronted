import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { type CartState } from '@/features/cart/cartSlice';
import authReducer, { type AuthState } from '@/features/auth/authSlice';

// Root state type - inferred from actual slices
export interface RootState {
  auth: AuthState;
  cart: CartState;
}

// Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootStateType = ReturnType<typeof store.getState>;
