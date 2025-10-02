import { API_CONFIG, apiRequest } from '@/config/api';

// City types
export interface City {
  id: number;
  name: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  pincode?: string;
  isActive: boolean;
  isMajorCity: boolean;
  population?: number;
  area?: number;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCityDto {
  name: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  pincode?: string;
  isActive?: boolean;
  isMajorCity?: boolean;
  population?: number;
  area?: number;
  timezone?: string;
}

export interface UpdateCityDto {
  name?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  pincode?: string;
  isActive?: boolean;
  isMajorCity?: boolean;
  population?: number;
  area?: number;
  timezone?: string;
}

export interface CitySearchFilters {
  search?: string;
  country?: string;
  state?: string;
  isActive?: boolean;
  isMajorCity?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface CitiesResponse {
  content: City[];
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

export interface DropdownOption {
  id: number;
  name: string;
  state?: string;
  country?: string;
}

export interface CityStatistics {
  totalCities: number;
  activeCities: number;
  majorCities: number;
  countriesCount: number;
  statesCount: number;
  cityDistribution: {
    country: string;
    count: number;
  }[];
}

class CityService {
  /**
   * Get all cities with pagination and filters
   */
  async getCities(filters: CitySearchFilters = {}): Promise<CitiesResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.CITIES.BASE}?${queryParams.toString()}`;
    return await apiRequest<CitiesResponse>(endpoint, { method: 'GET' });
  }

  /**
   * Get city by ID
   */
  async getCityById(cityId: number | string): Promise<City> {
    return await apiRequest<City>(
      `${API_CONFIG.ENDPOINTS.CITIES.BASE}/${cityId}`,
      { method: 'GET' }
    );
  }

  /**
   * Create city (Employee/Admin only)
   */
  async createCity(cityData: CreateCityDto): Promise<City> {
    return await apiRequest<City>(
      API_CONFIG.ENDPOINTS.CITIES.BASE,
      {
        method: 'POST',
        body: JSON.stringify(cityData)
      },
      true
    );
  }

  /**
   * Update city (Employee/Admin only)
   */
  async updateCity(cityId: number | string, cityData: UpdateCityDto): Promise<City> {
    return await apiRequest<City>(
      `${API_CONFIG.ENDPOINTS.CITIES.BASE}/${cityId}`,
      {
        method: 'PUT',
        body: JSON.stringify(cityData)
      },
      true
    );
  }

  /**
   * Delete city (Employee/Admin only)
   */
  async deleteCity(cityId: number | string): Promise<void> {
    return await apiRequest<void>(
      `${API_CONFIG.ENDPOINTS.CITIES.BASE}/${cityId}`,
      { method: 'DELETE' },
      true
    );
  }

  /**
   * Search cities
   */
  async searchCities(query: string, filters: Omit<CitySearchFilters, 'search'> = {}): Promise<CitiesResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('query', query);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiRequest<CitiesResponse>(
      `${API_CONFIG.ENDPOINTS.CITIES.SEARCH}?${queryParams.toString()}`,
      { method: 'GET' }
    );
  }

  /**
   * Get cities for dropdown
   */
  async getCitiesDropdown(filters: {
    country?: string;
    state?: string;
    majorCitiesOnly?: boolean;
  } = {}): Promise<DropdownOption[]> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiRequest<DropdownOption[]>(
      `${API_CONFIG.ENDPOINTS.CITIES.DROPDOWN}?${queryParams.toString()}`,
      { method: 'GET' }
    );
  }

  /**
   * Get distinct countries
   */
  async getCountries(): Promise<string[]> {
    return await apiRequest<string[]>(
      API_CONFIG.ENDPOINTS.CITIES.COUNTRIES,
      { method: 'GET' }
    );
  }

  /**
   * Get states by country
   */
  async getStates(country: string): Promise<string[]> {
    return await apiRequest<string[]>(
      `${API_CONFIG.ENDPOINTS.CITIES.STATES}?country=${encodeURIComponent(country)}`,
      { method: 'GET' }
    );
  }

  /**
   * Get nearby cities
   */
  async getNearbyCities(latitude: number, longitude: number, radiusKm = 100): Promise<City[]> {
    return await apiRequest<City[]>(
      `${API_CONFIG.ENDPOINTS.CITIES.NEARBY}?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`,
      { method: 'GET' }
    );
  }

  /**
   * Get city statistics
   */
  async getCityStatistics(): Promise<CityStatistics> {
    return await apiRequest<CityStatistics>(
      API_CONFIG.ENDPOINTS.CITIES.STATISTICS,
      { method: 'GET' }
    );
  }

  /**
   * Toggle city active status (Employee/Admin only)
   */
  async toggleCityStatus(cityId: number | string): Promise<City> {
    return await apiRequest<City>(
      `${API_CONFIG.ENDPOINTS.CITIES.TOGGLE_ACTIVE}/${cityId}/toggle-active`,
      { method: 'PATCH' },
      true
    );
  }

  // ========== PUBLIC API METHODS ==========

  /**
   * Get public cities (no auth required)
   */
  async getPublicCities(filters: CitySearchFilters = {}): Promise<CitiesResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiRequest<CitiesResponse>(
      `${API_CONFIG.ENDPOINTS.CITIES.PUBLIC}?${queryParams.toString()}`,
      { method: 'GET' },
      false
    );
  }

  // ========== DATA ENTRY API METHODS ==========

  /**
   * Get cities via data entry API
   */
  async getDataEntryCities(filters: CitySearchFilters = {}): Promise<CitiesResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiRequest<CitiesResponse>(
      `${API_CONFIG.ENDPOINTS.CITIES.DATA_ENTRY}?${queryParams.toString()}`,
      { method: 'GET' },
      true
    );
  }

  // ========== UTILITY METHODS ==========

  /**
   * Get major cities only
   */
  async getMajorCities(): Promise<City[]> {
    const response = await this.getCities({ isMajorCity: true, size: 1000 });
    return response.content;
  }

  /**
   * Get cities by state
   */
  async getCitiesByState(state: string, country = 'India'): Promise<City[]> {
    const response = await this.getCities({ state, country, size: 1000 });
    return response.content;
  }

  /**
   * Get active cities only
   */
  async getActiveCities(): Promise<City[]> {
    const response = await this.getCities({ isActive: true, size: 1000 });
    return response.content;
  }

  /**
   * Search cities by partial name match
   */
  async findCitiesByName(cityName: string): Promise<City[]> {
    const response = await this.searchCities(cityName);
    return response.content;
  }

  /**
   * Get cities for autocomplete/suggestions
   */
  async getCitySuggestions(query: string, limit = 10): Promise<DropdownOption[]> {
    const response = await this.searchCities(query, { size: limit });
    return response.content.map(city => ({
      id: city.id,
      name: city.name,
      state: city.state,
      country: city.country
    }));
  }

  /**
   * Check if city exists by name and state
   */
  async cityExists(cityName: string, state: string, country = 'India'): Promise<boolean> {
    try {
      const response = await this.getCities({ 
        search: cityName, 
        state, 
        country, 
        size: 1 
      });
      return response.content.length > 0;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const cityService = new CityService();

// Export the class for testing/advanced usage
export { CityService };

// Convenience exports
export const {
  getCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
  searchCities,
  getCitiesDropdown,
  getCountries,
  getStates,
  getNearbyCities,
  getCityStatistics,
  toggleCityStatus,
  getPublicCities,
  getDataEntryCities,
  getMajorCities,
  getCitiesByState,
  getActiveCities,
  findCitiesByName,
  getCitySuggestions,
  cityExists
} = cityService;
