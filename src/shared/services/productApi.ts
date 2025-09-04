import { api } from '@/shared/utils/apiClient';

export interface ProductDto {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: number;
  brand?: string;
  model?: string;
  sku?: string;
  minOrderQuantity?: number;
  unit?: string;
  specifications?: string;
  tags?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  freeShipping?: boolean;
  shippingCharge?: number;
  isActive?: boolean;
}

export const productAPI = {
  // Add product (vendor endpoint)
  addProduct: async (productDto: ProductDto): Promise<any> => {
    try {
      console.log('📦 ProductAPI: Adding product:', productDto.name);
      
      const response = await api.post('/products/vendor/add', productDto);
      console.log('✅ Product added successfully:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Error adding product:', error);
      
      let errorMessage = 'Error adding product';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            errorMessage = `Bad Request: ${data?.message || 'Invalid product data'}`;
            break;
          case 401:
            errorMessage = 'Unauthorized: Please log in as a vendor';
            break;
          case 403:
            errorMessage = 'Forbidden: Vendor access required';
            break;
          case 404:
            errorMessage = 'API endpoint not found - check backend server';
            break;
          case 500:
            errorMessage = 'Server Error: Please try again later';
            break;
          default:
            errorMessage = data?.message || `Error ${status}: ${error.response.statusText}`;
        }
      } else if (error.request) {
        errorMessage = 'Network Error: Unable to connect to backend server. Please ensure the backend is running on port 8080.';
      } else {
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      throw new Error(errorMessage);
    }
  },

  // Upload product images
  uploadProductImages: async (productId: number, images: File[]): Promise<string[]> => {
    try {
      const formData = new FormData();
      images.forEach(image => {
        formData.append('images', image);
      });

      console.log(`🖼️ Uploading ${images.length} images for product ${productId}`);
      
      const response = await api.post(`/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Images uploaded successfully:', response);
      return Array.isArray(response) ? response : (response as any).imageUrls || [];
    } catch (error: any) {
      console.error('❌ Error uploading product images:', error);
      throw error;
    }
  },

  // Get vendor's products
  getMyProducts: async (page = 0, size = 12): Promise<any> => {
    try {
      console.log('🔍 Fetching vendor products...');
      
      const response = await api.get('/products/vendor/my-products', {
        params: { page, size }
      });
      
      console.log('✅ Successfully fetched vendor products:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Error fetching vendor products:', error);
      
      // Return empty result to prevent app crash
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: size,
        first: true,
        last: true
      };
    }
  },

  // Get all products (public)
  getAllProducts: async (params: any = {}): Promise<any> => {
    try {
      const response = await api.get('/products', { params });
      return response;
    } catch (error: any) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/products/${id}`);
      return response;
    } catch (error: any) {
      console.error('❌ Error fetching product:', error);
      throw error;
    }
  },

  // Update product price
  updateProductPrice: async (productId: number, newPrice: number): Promise<any> => {
    try {
      console.log(`💰 Updating price for product ${productId} to ${newPrice}`);
      
      const response = await api.patch(`/products/${productId}/price`, { price: newPrice });
      
      console.log('✅ Product price updated successfully:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Error updating product price:', error);
      throw error;
    }
  },

  // Update product status (active/inactive)
  updateProductStatus: async (productId: number, isActive: boolean): Promise<any> => {
    try {
      console.log(`🔄 Updating status for product ${productId} to ${isActive ? 'active' : 'inactive'}`);
      
      const response = await api.patch(`/products/${productId}/status`, { isActive });
      
      console.log('✅ Product status updated successfully:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Error updating product status:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId: number): Promise<any> => {
    try {
      console.log(`🗑️ Deleting product ${productId}`);
      
      const response = await api.delete(`/products/${productId}`);
      
      console.log('✅ Product deleted successfully:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Error deleting product:', error);
      throw error;
    }
  }
};
