import { API_CONFIG, apiRequest } from '@/config/api';

// Types for Cart operations
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  totalPrice: number;
  vendor?: {
    id: number;
    name: string;
  };
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  cartItemId: number;
  quantity: number;
}

// Cart Service Class
class CartServiceClass {
  /**
   * Get user's cart
   */
  async getCart(): Promise<Cart> {
    console.log('🛒 Fetching user cart');
    try {
      const response = await apiRequest<Cart>(
        API_CONFIG.ENDPOINTS.CART.BASE,
        {
          method: 'GET'
        },
        true // Requires authentication
      );
      console.log('✅ Cart fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch cart:', error);
      throw new Error(error.message || 'Failed to fetch cart');
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(request: AddToCartRequest): Promise<Cart> {
    console.log('🛒 Adding item to cart:', request);
    try {
      const response = await apiRequest<Cart>(
        API_CONFIG.ENDPOINTS.CART.ADD,
        {
          method: 'POST',
          body: JSON.stringify(request)
        },
        true
      );
      console.log('✅ Item added to cart successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to add item to cart:', error);
      throw new Error(error.message || 'Failed to add item to cart');
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(cartItemId: number, quantity: number): Promise<Cart> {
    console.log('🔄 Updating cart item:', { cartItemId, quantity });
    try {
      const response = await apiRequest<Cart>(
        `${API_CONFIG.ENDPOINTS.CART.ITEM}/${cartItemId}?quantity=${quantity}`,
        {
          method: 'PUT'
        },
        true
      );
      console.log('✅ Cart item updated successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to update cart item:', error);
      throw new Error(error.message || 'Failed to update cart item');
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(cartItemId: number): Promise<Cart> {
    console.log('🗑️ Removing item from cart:', cartItemId);
    try {
      const response = await apiRequest<Cart>(
        `${API_CONFIG.ENDPOINTS.CART.ITEM}/${cartItemId}`,
        {
          method: 'DELETE'
        },
        true
      );
      console.log('✅ Item removed from cart successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to remove item from cart:', error);
      throw new Error(error.message || 'Failed to remove item from cart');
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<{ message: string }> {
    console.log('🧹 Clearing entire cart');
    try {
      const response = await apiRequest<{ message: string }>(
        API_CONFIG.ENDPOINTS.CART.CLEAR,
        {
          method: 'DELETE'
        },
        true
      );
      console.log('✅ Cart cleared successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to clear cart:', error);
      throw new Error(error.message || 'Failed to clear cart');
    }
  }

  /**
   * Get cart item count (helper method)
   */
  async getCartItemCount(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart.totalItems || 0;
    } catch (error) {
      console.error('❌ Failed to get cart item count:', error);
      return 0;
    }
  }

  /**
   * Get cart total amount (helper method)
   */
  async getCartTotal(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart.totalAmount || 0;
    } catch (error) {
      console.error('❌ Failed to get cart total:', error);
      return 0;
    }
  }

  /**
   * Check if product is in cart
   */
  async isProductInCart(productId: number): Promise<boolean> {
    try {
      const cart = await this.getCart();
      return cart.items.some(item => item.productId === productId);
    } catch (error) {
      console.error('❌ Failed to check if product is in cart:', error);
      return false;
    }
  }

  /**
   * Get cart item by product ID
   */
  async getCartItemByProduct(productId: number): Promise<CartItem | null> {
    try {
      const cart = await this.getCart();
      return cart.items.find(item => item.productId === productId) || null;
    } catch (error) {
      console.error('❌ Failed to get cart item by product:', error);
      return null;
    }
  }
}

// Export singleton instance
export const cartService = new CartServiceClass();

// Export the class for testing/advanced usage
export { CartServiceClass };

// Convenience exports
export const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartItemCount,
  getCartTotal,
  isProductInCart,
  getCartItemByProduct
} = cartService;
