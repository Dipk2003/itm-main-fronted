import { API_CONFIG, apiRequest } from '@/config/api';

// Category types
export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  parentCategoryId?: number;
  imageUrl?: string;
  iconUrl?: string;
  isActive: boolean;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
  subcategories?: SubCategory[];
  productCount?: number;
}

export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  slug: string;
  categoryId: number;
  imageUrl?: string;
  iconUrl?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  microcategories?: MicroCategory[];
  productCount?: number;
}

export interface MicroCategory {
  id: number;
  name: string;
  description?: string;
  slug: string;
  subCategoryId: number;
  imageUrl?: string;
  iconUrl?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  slug?: string;
  parentCategoryId?: number;
  imageUrl?: string;
  iconUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  iconUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface CreateSubCategoryDto {
  name: string;
  description?: string;
  slug?: string;
  categoryId: number;
  imageUrl?: string;
  iconUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateSubCategoryDto {
  name?: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  iconUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface CreateMicroCategoryDto {
  name: string;
  description?: string;
  slug?: string;
  subCategoryId: number;
  imageUrl?: string;
  iconUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateMicroCategoryDto {
  name?: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  iconUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface CategorySearchFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface CategoriesResponse {
  content: Category[];
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

class CategoryService {
  // ========== CATEGORIES ==========
  
  /**
   * Get all categories (with filters and pagination)
   */
  async getCategories(filters: CategorySearchFilters = {}): Promise<{
    success: boolean;
    data: Category[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalElements: number;
      size: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.CATEGORIES.BASE}?${queryParams.toString()}`;
    return await apiRequest<{
      success: boolean;
      data: Category[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalElements: number;
        size: number;
      };
    }>(endpoint, { method: 'GET' });
  }


  /**
   * Get root categories (top level)
   */
  async getRootCategories(): Promise<{
    success: boolean;
    data: Category[];
  }> {
    return await apiRequest<{
      success: boolean;
      data: Category[];
    }>(API_CONFIG.ENDPOINTS.CATEGORIES.ROOT, { method: 'GET' });
  }

  /**
   * Get vendor-visible categories
   */
  async getVendorVisibleCategories(): Promise<{
    success: boolean;
    data: Category[];
  }> {
    return await apiRequest<{
      success: boolean;
      data: Category[];
    }>(API_CONFIG.ENDPOINTS.CATEGORIES.VENDOR_VISIBLE, { method: 'GET' });
  }

  /**
   * Get customer-visible categories
   */
  async getCustomerVisibleCategories(): Promise<{
    success: boolean;
    data: Category[];
  }> {
    return await apiRequest<{
      success: boolean;
      data: Category[];
    }>(API_CONFIG.ENDPOINTS.CATEGORIES.CUSTOMER_VISIBLE, { method: 'GET' });
  }


  /**
   * Get category by ID
   */
  async getCategoryById(categoryId: number | string): Promise<Category> {
    return await apiRequest<Category>(
      `${API_CONFIG.ENDPOINTS.DATA_ENTRY.CATEGORIES}/${categoryId}`,
      { method: 'GET' }
    );
  }

  /**
   * Create category
   */
  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    return await apiRequest<Category>(
      API_CONFIG.ENDPOINTS.DATA_ENTRY.CATEGORIES,
      {
        method: 'POST',
        body: JSON.stringify(categoryData)
      },
      true
    );
  }

  /**
   * Update category
   */
  async updateCategory(categoryId: number | string, categoryData: UpdateCategoryDto): Promise<Category> {
    return await apiRequest<Category>(
      `${API_CONFIG.ENDPOINTS.DATA_ENTRY.CATEGORIES}/${categoryId}`,
      {
        method: 'PUT',
        body: JSON.stringify(categoryData)
      },
      true
    );
  }

  /**
   * Delete category
   */
  async deleteCategory(categoryId: number | string): Promise<void> {
    return await apiRequest<void>(
      `${API_CONFIG.ENDPOINTS.DATA_ENTRY.CATEGORIES}/${categoryId}`,
      { method: 'DELETE' },
      true
    );
  }

  // ========== SUBCATEGORIES ==========

  /**
   * Get all subcategories
   */
  async getSubcategories(filters: CategorySearchFilters = {}): Promise<SubCategory[]> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiRequest<SubCategory[]>(
      `${API_CONFIG.ENDPOINTS.DATA_ENTRY.SUBCATEGORIES}?${queryParams.toString()}`,
      { method: 'GET' }
    );
  }

  /**
   * Get subcategories by category
   */
  async getSubcategoriesByCategory(categoryId: number | string): Promise<SubCategory[]> {
    return await apiRequest<SubCategory[]>(
      `${API_CONFIG.ENDPOINTS.DATA_ENTRY.CATEGORIES}/${categoryId}/subcategories`,
      { method: 'GET' }
    );
  }

  /**
   * Create subcategory
   */
  async createSubcategory(subcategoryData: CreateSubCategoryDto): Promise<SubCategory> {
    return await apiRequest<SubCategory>(
      API_CONFIG.ENDPOINTS.DATA_ENTRY.SUBCATEGORIES,
      {
        method: 'POST',
        body: JSON.stringify(subcategoryData)
      },
      true
    );
  }

  /**
   * Update subcategory
   */
  async updateSubcategory(subcategoryId: number | string, subcategoryData: UpdateSubCategoryDto): Promise<SubCategory> {
    return await apiRequest<SubCategory>(
      `${API_CONFIG.ENDPOINTS.DATA_ENTRY.SUBCATEGORIES}/${subcategoryId}`,
      {
        method: 'PUT',
        body: JSON.stringify(subcategoryData)
      },
      true
    );
  }

  /**
   * Delete subcategory
   */
  async deleteSubcategory(subcategoryId: number | string): Promise<void> {
    return await apiRequest<void>(
      `${API_CONFIG.ENDPOINTS.DATA_ENTRY.SUBCATEGORIES}/${subcategoryId}`,
      { method: 'DELETE' },
      true
    );
  }

  // ========== MICROCATEGORIES ==========

  /**
   * Get all microcategories
   */
  async getMicrocategories(filters: CategorySearchFilters = {}): Promise<MicroCategory[]> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiRequest<MicroCategory[]>(
      `${API_CONFIG.ENDPOINTS.DATA_ENTRY.MICROCATEGORIES}?${queryParams.toString()}`,
      { method: 'GET' }
    );
  }

  /**
   * Get microcategories by subcategory
   */
  async getMicrocategoriesBySubcategory(subCategoryId: number | string): Promise<MicroCategory[]> {
    return await apiRequest<MicroCategory[]>(
      `${API_CONFIG.ENDPOINTS.DATA_ENTRY.SUBCATEGORIES}/${subCategoryId}/microcategories`,
      { method: 'GET' }
    );
  }

  /**
   * Create microcategory
   */
  async createMicrocategory(microcategoryData: CreateMicroCategoryDto): Promise<MicroCategory> {
    return await apiRequest<MicroCategory>(
      API_CONFIG.ENDPOINTS.DATA_ENTRY.MICROCATEGORIES,
      {
        method: 'POST',
        body: JSON.stringify(microcategoryData)
      },
      true
    );
  }

  /**
   * Update microcategory
   */
  async updateMicrocategory(microcategoryId: number | string, microcategoryData: UpdateMicroCategoryDto): Promise<MicroCategory> {
    return await apiRequest<MicroCategory>(
      `${API_CONFIG.ENDPOINTS.DATA_ENTRY.MICROCATEGORIES}/${microcategoryId}`,
      {
        method: 'PUT',
        body: JSON.stringify(microcategoryData)
      },
      true
    );
  }

  /**
   * Delete microcategory
   */
  async deleteMicrocategory(microcategoryId: number | string): Promise<void> {
    return await apiRequest<void>(
      `${API_CONFIG.ENDPOINTS.DATA_ENTRY.MICROCATEGORIES}/${microcategoryId}`,
      { method: 'DELETE' },
      true
    );
  }

  // ========== HIERARCHY & UTILITY METHODS ==========

  /**
   * Get category hierarchy (for mega menu)
   */
  async getCategoryHierarchy(): Promise<Category[]> {
    return await apiRequest<Category[]>(
      API_CONFIG.ENDPOINTS.CATEGORIES.HIERARCHY,
      { method: 'GET' }
    );
  }

  /**
   * Get category statistics
   */
  async getCategoryStatistics(): Promise<any> {
    return await apiRequest<any>(
      API_CONFIG.ENDPOINTS.CATEGORIES.STATS,
      { method: 'GET' }
    );
  }

  /**
   * Search categories
   */
  async searchCategories(searchTerm: string, filters: CategorySearchFilters = {}): Promise<Category[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('search', searchTerm);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== 'search') {
        queryParams.append(key, value.toString());
      }
    });

    return await apiRequest<Category[]>(
      `${API_CONFIG.ENDPOINTS.DATA_ENTRY.CATEGORIES}/search?${queryParams.toString()}`,
      { method: 'GET' }
    );
  }

  /**
   * Get active categories only
   */
  async getActiveCategories(): Promise<Category[]> {
    return await this.getCategories({ isActive: true }).then(response => response.data);
  }

  /**
   * Get category with full hierarchy (including subcategories and microcategories)
   */
  async getCategoryWithHierarchy(categoryId: number | string): Promise<Category> {
    const category = await this.getCategoryById(categoryId);
    const subcategories = await this.getSubcategoriesByCategory(categoryId);
    
    // Get microcategories for each subcategory
    for (const subcategory of subcategories) {
      subcategory.microcategories = await this.getMicrocategoriesBySubcategory(subcategory.id);
    }
    
    category.subcategories = subcategories;
    return category;
  }

  /**
   * Get categories for dropdown/select components
   */
  async getCategoriesForDropdown(): Promise<{ id: number; name: string; slug: string }[]> {
    const response = await this.getCategories({ isActive: true, size: 1000 });
    return response.data.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug
    }));
  }
}

// Export singleton instance
export const categoryService = new CategoryService();

// Export the class for testing/advanced usage
export { CategoryService };

// Convenience exports
export const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategories,
  getSubcategoriesByCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getMicrocategories,
  getMicrocategoriesBySubcategory,
  createMicrocategory,
  updateMicrocategory,
  deleteMicrocategory,
  getCategoryHierarchy,
  getCategoryStatistics,
  searchCategories,
  getActiveCategories,
  getCategoryWithHierarchy,
  getCategoriesForDropdown
} = categoryService;
