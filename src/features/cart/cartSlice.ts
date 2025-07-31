import { cartWishlistAPI } from '@/lib/cartWishlistApi';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

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

// Async thunks for backend integration
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartWishlistAPI.cart.get();
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (data: { productId: number; quantity: number }, { rejectWithValue }) => {
    try {
      const cartItem = await cartWishlistAPI.cart.addItem(data);
      return cartItem;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItem',
  async (data: { cartItemId: number; quantity: number }, { rejectWithValue }) => {
    try {
      const cartItem = await cartWishlistAPI.cart.updateItem(data.cartItemId, { quantity: data.quantity });
      return cartItem;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId: number, { rejectWithValue }) => {
    try {
      await cartWishlistAPI.cart.removeItem(cartItemId);
      return cartItemId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartWishlistAPI.cart.clear();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        // Convert backend cart format to local format if needed
        if (action.payload.items) {
          state.items = action.payload.items.map((item: any) => ({
            id: item.id.toString(),
            name: item.product.name,
            price: item.price.toString(),
            img_src: item.product.imageUrls || '',
            desc: item.product.description,
            company: item.product.vendor?.companyName || '',
            rating: '0',
            qty: item.quantity.toString(),
            user_name: '',
            user_email: '',
            date: new Date().toISOString(),
          }));
          state.totalItems = action.payload.totalItems;
          state.totalAmount = action.payload.totalAmount;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add the new item to local state
        const newItem: CartItem = {
          id: action.payload.id.toString(),
          name: action.payload.product.name,
          price: action.payload.price.toString(),
          img_src: action.payload.product.imageUrls || '',
          desc: action.payload.product.description,
          company: action.payload.product.vendor?.companyName || '',
          rating: '0',
          qty: action.payload.quantity.toString(),
          user_name: '',
          user_email: '',
          date: new Date().toISOString(),
        };
        state.items.push(newItem);
        state.totalItems = state.items.length;
        state.totalAmount = calculateTotalAmount(state.items);
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update cart item
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        const itemIndex = state.items.findIndex(item => item.id === action.payload.id.toString());
        if (itemIndex !== -1) {
          state.items[itemIndex].qty = action.payload.quantity.toString();
          state.totalAmount = calculateTotalAmount(state.items);
        }
      })
      // Remove from cart
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload.toString());
        state.totalItems = state.items.length;
        state.totalAmount = calculateTotalAmount(state.items);
      })
      // Clear cart
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalAmount = 0;
      });
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
