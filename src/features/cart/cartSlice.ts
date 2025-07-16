import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Cart Item Interface
export interface CartItem {
  id: string;
  name: string;
  price: string;
  img_src: string;
  desc: string;
  company: string;
  rating: string;
  discount?: string;
  delear_name?: string;
  qty: string;
  user_name: string;
  user_email: string;
  date: string;
  message?: string;
}

// Cart State Interface
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
}

// Initial State
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isLoading: false,
  error: null,
};

// Helper function to calculate total amount
const calculateTotalAmount = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
    const quantity = parseInt(item.qty) || 0;
    return total + (price * quantity);
  }, 0);
};

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        item.user_email === action.payload.user_email
      );

      if (existingItem) {
        // Update quantity if item already exists
        const newQty = parseInt(existingItem.qty) + parseInt(action.payload.qty);
        existingItem.qty = newQty.toString();
      } else {
        // Add new item
        state.items.push(action.payload);
      }

      // Update totals
      state.totalItems = state.items.length;
      state.totalAmount = calculateTotalAmount(state.items);
      state.error = null;
    },

    // Remove item from cart
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalItems = state.items.length;
      state.totalAmount = calculateTotalAmount(state.items);
    },

    // Update item quantity
    updateCartItemQuantity: (state, action: PayloadAction<{ id: string; qty: string }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.qty = action.payload.qty;
        state.totalAmount = calculateTotalAmount(state.items);
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.error = null;
    },

    // Set loading state
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Get cart items by user email
    getCartItemsByUser: (state, action: PayloadAction<string>) => {
      // This is handled by selector, but we can use it to filter if needed
      const userItems = state.items.filter(item => item.user_email === action.payload);
      // You can add any additional logic here if needed
    },
  },
});

// Export actions
export const {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
  clearCart,
  setCartLoading,
  setCartError,
  getCartItemsByUser,
} = cartSlice.actions;

// Export action creators for compatibility with old code
export const ADD_Cart_item = addCartItem;
export const REMOVE_Cart_item = removeCartItem;
export const UPDATE_Cart_item = updateCartItemQuantity;
export const CLEAR_Cart = clearCart;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotalItems = (state: { cart: CartState }) => state.cart.totalItems;
export const selectCartTotalAmount = (state: { cart: CartState }) => state.cart.totalAmount;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;

// Selector to get cart items by user
export const selectCartItemsByUser = (userEmail: string) => 
  (state: { cart: CartState }) => 
    state.cart.items.filter(item => item.user_email === userEmail);

// Export reducer
export default cartSlice.reducer;
