// Legacy cart actions for backward compatibility
// This file re-exports the modern Redux Toolkit actions

export { 
  ADD_Cart_item,
  REMOVE_Cart_item,
  UPDATE_Cart_item,
  CLEAR_Cart,
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
  clearCart,
  setCartLoading,
  setCartError,
  getCartItemsByUser,
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalAmount,
  selectCartLoading,
  selectCartError,
  selectCartItemsByUser,
  type CartItem
} from '@/features/cart/cartSlice';
