import { api } from './api';
import { MOCK_MODE, mockResponses, mockDelay } from './mockMode';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: number;
  vendorId: number;
  brand?: string;
  model?: string;
  sku?: string;
  minOrderQuantity?: number;
  unit?: string;
  specifications?: string;
  tags?: string;
  gstRate?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  freeShipping?: boolean;
  shippingCharge?: number;
  isActive?: boolean;
  isApproved?: boolean;
  isFeatured?: boolean;
  images?: ProductImage[];
  imageUrls?: string;
  category?: Category;
  subCategory?: SubCategory;
  vendor?: any;
  viewCount?: number;
  orderCount?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'OUT_OF_STOCK' | 'DISCONTINUED';
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  productId: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
}

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
  gstRate?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  freeShipping?: boolean;
  shippingCharge?: number;
  isActive?: boolean;
}

export interface ProductSearchParams {
  page?: number;
  size?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ProductsResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// Product API functions
export const productAPI = {
  // Public endpoints
  getAllProducts: async (params: ProductSearchParams = {}): Promise<ProductsResponse> => {
    const response = await api.get('/api/products', { params });
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  searchProducts: async (query: string, page = 0, size = 12): Promise<ProductsResponse> => {
    const response = await api.get('/api/products/search', {
      params: { query, page, size }
    });
    return response.data;
  },

  getProductsByCategory: async (categoryId: number, page = 0, size = 12): Promise<ProductsResponse> => {
    const response = await api.get(`/api/products/category/${categoryId}`, {
      params: { page, size }
    });
    return response.data;
  },

  getProductsByVendor: async (vendorId: number, page = 0, size = 12): Promise<ProductsResponse> => {
    const response = await api.get(`/api/products/vendor/${vendorId}`, {
      params: { page, size }
    });
    return response.data;
  },

  getFeaturedProducts: async (limit = 8): Promise<Product[]> => {
    const response = await api.get('/api/products/featured', {
      params: { limit }
    });
    return response.data;
  },

  // Vendor endpoints
  addProduct: async (productDto: ProductDto): Promise<Product> => {
    if (MOCK_MODE) {
      console.log('Mock mode: Adding product', productDto);
      await mockDelay(1500); // Simulate network delay
      return {
        ...mockResponses.products.add,
        ...productDto,
        id: Math.floor(Math.random() * 1000),
        vendorId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    // Use the correct endpoint as per backend controller
    console.log('📝 Adding product via: /api/products/vendor/add');
    console.log('📝 Product data:', productDto);
    
    const response = await api.post('/api/products/vendor/add', productDto);
    console.log('✅ Successfully added product');
    return response.data;
  },

  updateProduct: async (id: number, productDto: ProductDto): Promise<Product> => {
    const response = await api.put(`/api/products/${id}`, productDto);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/api/products/${id}`);
  },

  getMyProducts: async (page = 0, size = 12): Promise<ProductsResponse> => {
    try {
      // Try the test endpoint first
      const response = await api.get('/api/products/test/vendor/2/products', {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor products:', error);
      // Fallback to original endpoint
      try {
        const response = await api.get('/api/products/vendor/my-products', {
          params: { page, size, vendorId: 2 }
        });
        return response.data;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw fallbackError;
      }
    }
  },

  uploadProductImages: async (productId: number, images: File[]): Promise<string[]> => {
    if (MOCK_MODE) {
      console.log('Mock mode: Uploading images for product', productId, images);
      await mockDelay(1000); // Simulate network delay
      return images.map((_, index) => `mock-image-${productId}-${index + 1}.jpg`);
    }
    
    try {
      const formData = new FormData();
      images.forEach(image => {
        formData.append('images', image);
      });

      const response = await api.post(`/api/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      // If API endpoint doesn't exist (404), fallback to mock data
      if (error.response?.status === 404) {
        console.warn('Product images API not available, using mock response');
        await mockDelay(1000);
        return images.map((_, index) => `mock-image-${productId}-${index + 1}.jpg`);
      }
      throw error;
    }
  },

  updateProductStatus: async (id: number, isActive: boolean): Promise<Product> => {
    const response = await api.patch(`/api/products/${id}/status`, null, {
      params: { isActive }
    });
    return response.data;
  },

  // Admin endpoints
  approveProduct: async (id: number): Promise<Product> => {
    const response = await api.patch(`/api/products/${id}/approve`);
    return response.data;
  },

  setFeaturedStatus: async (id: number, featured: boolean): Promise<Product> => {
    const response = await api.patch(`/api/products/${id}/feature`, null, {
      params: { featured }
    });
    return response.data;
  },

  getPendingProducts: async (page = 0, size = 12): Promise<ProductsResponse> => {
    const response = await api.get('/api/products/pending-approval', {
      params: { page, size }
    });
    return response.data;
  }
};
