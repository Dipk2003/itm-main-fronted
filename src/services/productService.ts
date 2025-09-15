import { API_CONFIG, apiRequest } from '@/config/api';

// Product types
export interface ProductDto {
  id?: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  subCategory?: string;
  microCategory?: string;
  vendorId?: number;
  images?: string[];
  specifications?: Record<string, any>;
  isActive?: boolean;
  isFeatured?: boolean;
  stock?: number;
  minOrderQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductSearchFilters {
  query?: string;
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ProductsResponse {
  content: ProductDto[];
  totalElements: number;
  totalPages: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any;
  };
  first: boolean;
  last: boolean;
}

class ProductService {
  /**
   * Get all products with pagination and filters
   */
  async getProducts(filters: ProductSearchFilters = {}): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    
    // Add filters as query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}?${queryParams.toString()}`;
    return await apiRequest<ProductsResponse>(endpoint, { method: 'GET' });
  }

  /**
   * Get product by ID
   */
  async getProductById(productId: number | string): Promise<ProductDto> {
    return await apiRequest<ProductDto>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}/${productId}`,
      { method: 'GET' }
    );
  }

  /**
   * Search products
   */
  async searchProducts(filters: ProductSearchFilters): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH}?${queryParams.toString()}`;
    return await apiRequest<ProductsResponse>(endpoint, { method: 'GET' });
  }

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(query: string): Promise<string[]> {
    return await apiRequest<string[]>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH_SUGGESTIONS}?query=${encodeURIComponent(query)}`,
      { method: 'GET' }
    );
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: number | string, page = 0, size = 20): Promise<ProductsResponse> {
    return await apiRequest<ProductsResponse>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.BY_CATEGORY}/${categoryId}?page=${page}&size=${size}`,
      { method: 'GET' }
    );
  }

  /**
   * Get products by vendor
   */
  async getProductsByVendor(vendorId: number | string, page = 0, size = 20): Promise<ProductsResponse> {
    return await apiRequest<ProductsResponse>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.BY_VENDOR}/${vendorId}?page=${page}&size=${size}`,
      { method: 'GET' }
    );
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 10): Promise<ProductDto[]> {
    return await apiRequest<ProductDto[]>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.FEATURED}?limit=${limit}`,
      { method: 'GET' }
    );
  }

  /**
   * Get filtered products by category hierarchy
   */
  async getFilteredProducts(filters: {
    category?: string;
    subCategory?: string;
    microCategory?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }): Promise<ProductDto[]> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiRequest<ProductDto[]>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.CATEGORIES}?${queryParams.toString()}`,
      { method: 'GET' }
    );
  }

  /**
   * Add product (vendor only)
   */
  async addProduct(productData: ProductDto): Promise<ProductDto> {
    return await apiRequest<ProductDto>(
      API_CONFIG.ENDPOINTS.PRODUCTS.BASE,
      {
        method: 'POST',
        body: JSON.stringify(productData)
      },
      true // Requires authentication
    );
  }

  /**
   * Add product via data entry (employee only)
   */
  async addDataEntryProduct(productData: ProductDto): Promise<ProductDto> {
    return await apiRequest<ProductDto>(
      API_CONFIG.ENDPOINTS.PRODUCTS.DATA_ENTRY,
      {
        method: 'POST',
        body: JSON.stringify(productData)
      },
      true // Requires authentication
    );
  }

  /**
   * Update product
   */
  async updateProduct(productId: number | string, productData: ProductDto): Promise<ProductDto> {
    return await apiRequest<ProductDto>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}/${productId}`,
      {
        method: 'PUT',
        body: JSON.stringify(productData)
      },
      true
    );
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: number | string): Promise<void> {
    return await apiRequest<void>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}/${productId}`,
      { method: 'DELETE' },
      true
    );
  }

  /**
   * Get vendor's own products
   */
  async getMyProducts(page = 0, size = 12): Promise<ProductsResponse> {
    return await apiRequest<ProductsResponse>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}/vendor/my-products?page=${page}&size=${size}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Upload product images
   */
  async uploadProductImages(productId: number | string, images: FormData): Promise<{
    message: string;
    imageUrls: string[];
    productId: number;
  }> {
    return await apiRequest<{
      message: string;
      imageUrls: string[];
      productId: number;
    }>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}/${productId}/images`,
      {
        method: 'POST',
        body: images
      },
      true,
      false // Don't set JSON content-type for FormData
    );
  }

  /**
   * Update product images
   */
  async updateProductImages(productId: number | string, images: FormData): Promise<{
    message: string;
    imageUrls: string[];
    productId: number;
  }> {
    return await apiRequest<{
      message: string;
      imageUrls: string[];
      productId: number;
    }>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}/${productId}/images`,
      {
        method: 'PUT',
        body: images
      },
      true,
      false // Don't set JSON content-type for FormData
    );
  }

  /**
   * Update product status (active/inactive)
   */
  async updateProductStatus(productId: number | string, isActive: boolean): Promise<ProductDto> {
    return await apiRequest<ProductDto>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}/${productId}/status?isActive=${isActive}`,
      { method: 'PATCH' },
      true
    );
  }

  /**
   * Get pending approval products (Admin only)
   */
  async getPendingApprovalProducts(page = 0, size = 12): Promise<ProductsResponse> {
    return await apiRequest<ProductsResponse>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}/pending-approval?page=${page}&size=${size}`,
      { method: 'GET' },
      true
    );
  }

  /**
   * Approve product (Admin only)
   */
  async approveProduct(productId: number | string): Promise<ProductDto> {
    return await apiRequest<ProductDto>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}/${productId}/approve`,
      { method: 'PATCH' },
      true
    );
  }

  /**
   * Set featured status (Admin only)
   */
  async setFeaturedStatus(productId: number | string, featured: boolean): Promise<ProductDto> {
    return await apiRequest<ProductDto>(
      `${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}/${productId}/feature?featured=${featured}`,
      { method: 'PATCH' },
      true
    );
  }
}

// Export singleton instance
export const productService = new ProductService();

// Export the class for testing/advanced usage
export { ProductService };

// Convenience exports
export const {
  getProducts,
  getProductById,
  searchProducts,
  getSearchSuggestions,
  getProductsByCategory,
  getProductsByVendor,
  getFeaturedProducts,
  getFilteredProducts,
  addProduct,
  addDataEntryProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  uploadProductImages,
  updateProductImages,
  updateProductStatus,
  getPendingApprovalProducts,
  approveProduct,
  setFeaturedStatus
} = productService;
