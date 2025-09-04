import { api } from '@/shared/utils/apiClient';

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export const categoryAPI = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      console.log('📂 Fetching categories...');
      
      // Try multiple endpoints as backend might have different paths
      const endpoints = [
        '/categories',
        '/products/categories',
        '/api/categories'
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.get<Category[]>(endpoint);
          console.log(`✅ Categories fetched from ${endpoint}:`, response);
          return Array.isArray(response) ? response : [];
        } catch (error) {
          console.log(`❌ Failed to fetch from ${endpoint}`);
          continue;
        }
      }
      
      // Fallback categories
      console.log('🔄 Using fallback categories');
      return [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Computer Accessories' },
        { id: 3, name: 'Mobile Accessories' },
        { id: 4, name: 'Office Supplies' },
        { id: 5, name: 'Hardware & Tools' },
        { id: 6, name: 'Networking Equipment' },
        { id: 7, name: 'Audio & Video' },
        { id: 8, name: 'Storage Devices' }
      ];
      
    } catch (error: any) {
      console.error('❌ Error fetching categories:', error);
      
      // Return fallback categories
      return [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Computer Accessories' },
        { id: 3, name: 'Mobile Accessories' },
        { id: 4, name: 'Office Supplies' },
        { id: 5, name: 'Hardware & Tools' }
      ];
    }
  }
};
