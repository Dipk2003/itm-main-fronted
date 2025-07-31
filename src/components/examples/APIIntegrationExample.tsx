'use client';

import {
    additionalAPI,
    analyticsApi,
    cartWishlistAPI,
    inquiryQuoteAPI,
    orderAPI,
    productAPI,
    supportAPI,
    userAPI
} from '@/lib';
import { useState } from 'react';

/**
 * This component demonstrates how to use all the integrated backend APIs
 * It serves as a reference for developers on how to implement API calls
 */
export default function APIIntegrationExample() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({});

  // Example: User Management API
  const testUserAPI = async () => {
    setLoading(true);
    try {
      // Get user dashboard data
      const dashboardData = await userAPI.getDashboardData();
      console.log('User Dashboard Data:', dashboardData);

      // Get user addresses
      const addresses = await userAPI.addresses.getAll();
      console.log('User Addresses:', addresses);

      setResults(prev => ({ ...prev, userAPI: { dashboardData, addresses } }));
    } catch (error) {
      console.error('User API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example: Product Management API
  const testProductAPI = async () => {
    setLoading(true);
    try {
      // Get products with pagination
      const products = await productAPI.getProducts(0, 10);
      console.log('Products:', products);

      // Advanced search
      const searchResults = await productAPI.advancedSearch({
        query: 'laptop',
        minPrice: 1000,
        maxPrice: 50000,
        page: 0,
        size: 5
      });
      console.log('Search Results:', searchResults);

      // Get featured products
      const featuredProducts = await productAPI.getFeaturedProducts();
      console.log('Featured Products:', featuredProducts);

      setResults(prev => ({ ...prev, productAPI: { products, searchResults, featuredProducts } }));
    } catch (error) {
      console.error('Product API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example: Cart & Wishlist API
  const testCartWishlistAPI = async () => {
    setLoading(true);
    try {
      // Get user cart
      const cart = await cartWishlistAPI.cart.get();
      console.log('User Cart:', cart);

      // Get wishlist
      const wishlist = await cartWishlistAPI.wishlist.get();
      console.log('User Wishlist:', wishlist);

      // Add to cart (example with product ID 1)
      // const addedItem = await cartWishlistAPI.cart.addItem({ productId: 1, quantity: 2 });
      // console.log('Added to Cart:', addedItem);

      setResults(prev => ({ ...prev, cartWishlistAPI: { cart, wishlist } }));
    } catch (error) {
      console.error('Cart/Wishlist API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example: Inquiry & Quote API
  const testInquiryQuoteAPI = async () => {
    setLoading(true);
    try {
      // Get user inquiries
      const userInquiries = await inquiryQuoteAPI.inquiries.getUserInquiries();
      console.log('User Inquiries:', userInquiries);

      // Get user quotes
      const userQuotes = await inquiryQuoteAPI.quotes.getUserQuotes();
      console.log('User Quotes:', userQuotes);

      setResults(prev => ({ ...prev, inquiryQuoteAPI: { userInquiries, userQuotes } }));
    } catch (error) {
      console.error('Inquiry/Quote API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example: Order Management API
  const testOrderAPI = async () => {
    setLoading(true);
    try {
      // Get user orders
      const orders = await orderAPI.getMyOrders();
      console.log('User Orders:', orders);

      // Get order analytics
      const orderStats = await orderAPI.analytics.getUserStats();
      console.log('Order Analytics:', orderStats);

      setResults(prev => ({ ...prev, orderAPI: { orders, orderStats } }));
    } catch (error) {
      console.error('Order API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example: Support API
  const testSupportAPI = async () => {
    setLoading(true);
    try {
      // Get support tickets
      const tickets = await supportAPI.getTickets();
      console.log('Support Tickets:', tickets);

      setResults(prev => ({ ...prev, supportAPI: { tickets } }));
    } catch (error) {
      console.error('Support API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example: Analytics API
  const testAnalyticsAPI = async () => {
    setLoading(true);
    try {
      // Get vendor analytics (if user is vendor)
      const vendorOverview = await analyticsApi.vendor.getOverview();
      console.log('Vendor Analytics:', vendorOverview);

      setResults(prev => ({ ...prev, analyticsAPI: { vendorOverview } }));
    } catch (error) {
      console.error('Analytics API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example: Additional APIs
  const testAdditionalAPIs = async () => {
    setLoading(true);
    try {
      // Get notifications
      const notifications = await additionalAPI.notifications.getAll();
      console.log('Notifications:', notifications);

      // Get subscription plans
      const plans = await additionalAPI.subscriptions.getPlans();
      console.log('Subscription Plans:', plans);

      // Get banners
      const banners = await additionalAPI.content.getBanners();
      console.log('Banners:', banners);

      // Health check
      const health = await additionalAPI.health.check();
      console.log('Health Status:', health);

      setResults(prev => ({ 
        ...prev, 
        additionalAPI: { notifications, plans, banners, health } 
      }));
    } catch (error) {
      console.error('Additional APIs Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Integration Examples</h1>
      <p className="text-gray-600 mb-8">
        This component demonstrates how to use all the integrated backend APIs. 
        Check the browser console for detailed responses.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <button
          onClick={testUserAPI}
          disabled={loading}
          className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Test User API
        </button>

        <button
          onClick={testProductAPI}
          disabled={loading}
          className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          Test Product API
        </button>

        <button
          onClick={testCartWishlistAPI}
          disabled={loading}
          className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
        >
          Test Cart/Wishlist API
        </button>

        <button
          onClick={testInquiryQuoteAPI}
          disabled={loading}
          className="p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          Test Inquiry/Quote API
        </button>

        <button
          onClick={testOrderAPI}
          disabled={loading}
          className="p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          Test Order API
        </button>

        <button
          onClick={testSupportAPI}
          disabled={loading}
          className="p-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
        >
          Test Support API
        </button>

        <button
          onClick={testAnalyticsAPI}
          disabled={loading}
          className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
        >
          Test Analytics API
        </button>

        <button
          onClick={testAdditionalAPIs}
          disabled={loading}
          className="p-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
        >
          Test Additional APIs
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2">Testing APIs...</p>
        </div>
      )}

      {Object.keys(results).length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">API Results</h2>
          <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
            <pre className="text-sm">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Usage Instructions:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Click any button to test the corresponding API endpoints</li>
          <li>Check the browser console for detailed API responses</li>
          <li>Results will also be displayed in the results section below</li>
          <li>Make sure you're authenticated before testing user-specific APIs</li>
          <li>Some APIs may require specific user roles (vendor, admin)</li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Available APIs:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium">Core APIs:</h4>
            <ul className="list-disc list-inside ml-4">
              <li>Authentication & Authorization</li>
              <li>User Management</li>
              <li>Vendor Management</li>
              <li>Product Management</li>
              <li>Cart & Wishlist</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Business APIs:</h4>
            <ul className="list-disc list-inside ml-4">
              <li>Inquiry & Quote System</li>
              <li>Order Management</li>
              <li>Chat & Communication</li>
              <li>Support System</li>
              <li>Finance & Payment</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Analytics & Content:</h4>
            <ul className="list-disc list-inside ml-4">
              <li>Analytics & Dashboards</li>
              <li>Notifications</li>
              <li>Content Management</li>
              <li>File Management</li>
              <li>Health & System</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}