import { API_CONFIG, apiRequest } from '@/config/api';

// Types for Order operations
export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  totalPrice?: number;
  vendor?: {
    id: number;
    name: string;
  };
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
  razorpayOrderId?: string;
  trackingNumber?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  PAYMENT_PENDING = 'PAYMENT_PENDING'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface CheckoutRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: 'RAZORPAY' | 'COD' | 'BANK_TRANSFER';
  notes?: string;
}

export interface CheckoutResponse {
  orderId: number;
  orderNumber: string;
  amount: number;
  razorpayOrderId?: string;
  status: OrderStatus;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaginatedOrders {
  content: Order[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Order Service Class
class OrderServiceClass {
  /**
   * Checkout - Create order from cart
   */
  async checkout(request: CheckoutRequest): Promise<CheckoutResponse> {
    console.log('🛒 Processing checkout:', request);
    try {
      const response = await apiRequest<CheckoutResponse>(
        API_CONFIG.ENDPOINTS.ORDERS.CHECKOUT,
        {
          method: 'POST',
          body: JSON.stringify(request)
        },
        true
      );
      console.log('✅ Checkout successful:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Checkout failed:', error);
      throw new Error(error.message || 'Checkout failed');
    }
  }

  /**
   * Verify payment after successful Razorpay payment
   */
  async verifyPayment(request: PaymentVerificationRequest): Promise<{ status: string; message: string }> {
    console.log('💳 Verifying payment:', request.razorpay_order_id);
    try {
      const response = await apiRequest<{ status: string; message: string }>(
        API_CONFIG.ENDPOINTS.ORDERS.VERIFY_PAYMENT,
        {
          method: 'POST',
          body: JSON.stringify(request)
        },
        true
      );
      console.log('✅ Payment verification successful');
      return response;
    } catch (error: any) {
      console.error('❌ Payment verification failed:', error);
      throw new Error(error.message || 'Payment verification failed');
    }
  }

  /**
   * Get user's orders (simple list)
   */
  async getMyOrders(): Promise<Order[]> {
    console.log('📦 Fetching user orders');
    try {
      const response = await apiRequest<Order[]>(
        API_CONFIG.ENDPOINTS.ORDERS.MY_ORDERS,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ Orders fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch orders:', error);
      throw new Error(error.message || 'Failed to fetch orders');
    }
  }

  /**
   * Get user's orders with pagination
   */
  async getMyOrdersPaginated(page: number = 0, size: number = 10): Promise<PaginatedOrders> {
    console.log('📦 Fetching user orders with pagination:', { page, size });
    try {
      const response = await apiRequest<PaginatedOrders>(
        `${API_CONFIG.ENDPOINTS.ORDERS.MY_ORDERS_PAGINATED}?page=${page}&size=${size}`,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ Paginated orders fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch paginated orders:', error);
      throw new Error(error.message || 'Failed to fetch orders');
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: number): Promise<Order> {
    console.log('🔍 Fetching order by ID:', orderId);
    try {
      const response = await apiRequest<Order>(
        `${API_CONFIG.ENDPOINTS.ORDERS.BASE}/${orderId}`,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ Order fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch order:', error);
      throw new Error(error.message || 'Failed to fetch order');
    }
  }

  /**
   * Get order by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    console.log('🔍 Fetching order by number:', orderNumber);
    try {
      const response = await apiRequest<Order>(
        `${API_CONFIG.ENDPOINTS.ORDERS.BY_NUMBER}/${orderNumber}`,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ Order fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch order:', error);
      throw new Error(error.message || 'Failed to fetch order');
    }
  }

  /**
   * Get vendor orders (for vendors only)
   */
  async getVendorOrders(): Promise<Order[]> {
    console.log('🏪 Fetching vendor orders');
    try {
      const response = await apiRequest<Order[]>(
        API_CONFIG.ENDPOINTS.ORDERS.VENDOR_ORDERS,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ Vendor orders fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch vendor orders:', error);
      throw new Error(error.message || 'Failed to fetch vendor orders');
    }
  }

  /**
   * Get vendor orders with pagination
   */
  async getVendorOrdersPaginated(page: number = 0, size: number = 10): Promise<PaginatedOrders> {
    console.log('🏪 Fetching vendor orders with pagination:', { page, size });
    try {
      const response = await apiRequest<PaginatedOrders>(
        `${API_CONFIG.ENDPOINTS.ORDERS.VENDOR_ORDERS_PAGINATED}?page=${page}&size=${size}`,
        {
          method: 'GET'
        },
        true
      );
      console.log('✅ Vendor paginated orders fetched successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to fetch vendor orders:', error);
      throw new Error(error.message || 'Failed to fetch vendor orders');
    }
  }

  /**
   * Update order status (Admin/Vendor only)
   */
  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    console.log('🔄 Updating order status:', { orderId, status });
    try {
      const response = await apiRequest<Order>(
        `${API_CONFIG.ENDPOINTS.ORDERS.STATUS_UPDATE}/${orderId}/status?status=${status}`,
        {
          method: 'PUT'
        },
        true
      );
      console.log('✅ Order status updated successfully');
      return response;
    } catch (error: any) {
      console.error('❌ Failed to update order status:', error);
      throw new Error(error.message || 'Failed to update order status');
    }
  }

  /**
   * Cancel order (if allowed)
   */
  async cancelOrder(orderId: number): Promise<Order> {
    return this.updateOrderStatus(orderId, OrderStatus.CANCELLED);
  }

  /**
   * Get order statistics (for dashboard)
   */
  async getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalAmount: number;
  }> {
    console.log('📊 Fetching order statistics');
    try {
      // This would be a separate endpoint in a real scenario
      const orders = await this.getMyOrders();
      
      const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.PROCESSING).length,
        completedOrders: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
        totalAmount: orders.reduce((sum, o) => sum + o.totalAmount, 0)
      };
      
      console.log('✅ Order statistics calculated');
      return stats;
    } catch (error: any) {
      console.error('❌ Failed to get order statistics:', error);
      throw new Error(error.message || 'Failed to get order statistics');
    }
  }

  /**
   * Track order (helper method)
   */
  async trackOrder(orderNumber: string): Promise<{
    order: Order;
    trackingHistory: Array<{
      status: OrderStatus;
      timestamp: string;
      message: string;
    }>;
  }> {
    console.log('📍 Tracking order:', orderNumber);
    try {
      const order = await this.getOrderByNumber(orderNumber);
      
      // Mock tracking history - in real scenario, this would be a separate endpoint
      const trackingHistory = [
        {
          status: OrderStatus.PENDING,
          timestamp: order.createdAt,
          message: 'Order placed successfully'
        },
        {
          status: order.status,
          timestamp: order.updatedAt || order.createdAt,
          message: this.getStatusMessage(order.status)
        }
      ];

      console.log('✅ Order tracking information retrieved');
      return { order, trackingHistory };
    } catch (error: any) {
      console.error('❌ Failed to track order:', error);
      throw new Error(error.message || 'Failed to track order');
    }
  }

  /**
   * Helper method to get status message
   */
  private getStatusMessage(status: OrderStatus): string {
    const messages = {
      [OrderStatus.PENDING]: 'Order is being processed',
      [OrderStatus.CONFIRMED]: 'Order confirmed',
      [OrderStatus.PROCESSING]: 'Order is being prepared',
      [OrderStatus.SHIPPED]: 'Order has been shipped',
      [OrderStatus.DELIVERED]: 'Order delivered successfully',
      [OrderStatus.CANCELLED]: 'Order has been cancelled',
      [OrderStatus.PAYMENT_PENDING]: 'Payment is pending'
    };
    return messages[status] || 'Unknown status';
  }
}

// Export singleton instance
export const orderService = new OrderServiceClass();

// Export the class for testing/advanced usage
export { OrderServiceClass };

// Convenience exports
export const {
  checkout,
  verifyPayment,
  getMyOrders,
  getMyOrdersPaginated,
  getOrderById,
  getOrderByNumber,
  getVendorOrders,
  getVendorOrdersPaginated,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  trackOrder
} = orderService;
