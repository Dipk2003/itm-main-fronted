'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/shared/components/Card';
import { Input } from '@/shared/components/Input';
import { Select } from '@/shared/components/Select';
import MultiSelect from '@/shared/components/MultiSelect';
import { Button } from '@/shared/components/Button';
import Checkbox from '@/shared/components/Checkbox';
import RangeSlider from '@/shared/components/RangeSlider';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FilterIcon,
  SearchIcon,
  XIcon
} from '@heroicons/react/outline';

interface SearchFilters {
  query: string;
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  minRating: number | null;
  specifications: Record<string, string[]>;
  city: string;
  state: string;
  inStockOnly: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface Aggregations {
  categories: { [key: string]: number };
  brands: { [key: string]: number };
  priceRanges: { [key: string]: number };
  cities: { [key: string]: number };
  states: { [key: string]: number };
  ratings: { [key: string]: number };
}

const AdvancedProductSearch: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    brands: [],
    priceRange: [0, 100000],
    minRating: null,
    specifications: {},
    city: '',
    state: '',
    inStockOnly: false,
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const [aggregations, setAggregations] = useState<Aggregations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['categories', 'price']));

  useEffect(() => {
    // Load initial filters from URL
    const query = searchParams.get('q') || '';
    const categories = searchParams.getAll('category');
    const brands = searchParams.getAll('brand');
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 100000;
    const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : null;
    const city = searchParams.get('city') || '';
    const state = searchParams.get('state') || '';
    const inStockOnly = searchParams.get('inStock') === 'true';
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Load specifications from URL
    const specs: Record<string, string[]> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('spec_')) {
        const specName = key.replace('spec_', '');
        specs[specName] = value.split(',');
      }
    }

    setFilters({
      query,
      categories,
      brands,
      priceRange: [minPrice, maxPrice],
      minRating,
      specifications: specs,
      city,
      state,
      inStockOnly,
      sortBy,
      sortOrder
    });

    // Load initial aggregations
    loadAggregations();
  }, [searchParams]);

  const loadAggregations = async () => {
    try {
      const response = await fetch('/api/search/aggregations');
      const data = await response.json();
      setAggregations(data);
    } catch (error) {
      console.error('Error loading aggregations:', error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    
    if (filters.query) params.set('q', filters.query);
    filters.categories.forEach(cat => params.append('category', cat));
    filters.brands.forEach(brand => params.append('brand', brand));
    params.set('minPrice', filters.priceRange[0].toString());
    params.set('maxPrice', filters.priceRange[1].toString());
    if (filters.minRating !== null) params.set('minRating', filters.minRating.toString());
    if (filters.city) params.set('city', filters.city);
    if (filters.state) params.set('state', filters.state);
    if (filters.inStockOnly) params.set('inStock', 'true');
    if (filters.sortBy !== 'relevance') {
      params.set('sortBy', filters.sortBy);
      params.set('sortOrder', filters.sortOrder);
    }

    // Add specifications to URL
    Object.entries(filters.specifications).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(`spec_${key}`, values.join(','));
      }
    });

    router.push(`/search?${params.toString()}`);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSpecificationChange = (name: string, values: string[]) => {
    setFilters(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: values
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      categories: [],
      brands: [],
      priceRange: [0, 100000],
      minRating: null,
      specifications: {},
      city: '',
      state: '',
      inStockOnly: false,
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
    router.push('/search');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Filters Sidebar */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <FilterIcon className="h-5 w-5 mr-2" />
                Filters
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-600"
              >
                Clear All
              </Button>
            </div>

            {/* Categories */}
            <div className="border-b pb-4 mb-4">
              <button
                onClick={() => toggleSection('categories')}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <span className="font-medium">Categories</span>
                {expandedSections.has('categories') ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>
              {expandedSections.has('categories') && (
                <MultiSelect
                  options={aggregations?.categories ? 
                    Object.entries(aggregations.categories).map(([name, count]) => ({
                      label: `${name} (${count})`,
                      value: name
                    })) : []
                  }
                  value={filters.categories}
                  onChange={(value) => handleFilterChange('categories', value)}
                  className="w-full"
                />
              )}
            </div>

            {/* Price Range */}
            <div className="border-b pb-4 mb-4">
              <button
                onClick={() => toggleSection('price')}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <span className="font-medium">Price Range</span>
                {expandedSections.has('price') ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>
              {expandedSections.has('price') && (
                <>
                  <RangeSlider
                    min={0}
                    max={100000}
                    step={100}
                    value={filters.priceRange}
                    onChange={(value) => handleFilterChange('priceRange', value)}
                  />
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}</span>
                  </div>
                </>
              )}
            </div>

            {/* Brands */}
            <div className="border-b pb-4 mb-4">
              <button
                onClick={() => toggleSection('brands')}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <span className="font-medium">Brands</span>
                {expandedSections.has('brands') ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>
              {expandedSections.has('brands') && (
                <MultiSelect
                  options={aggregations?.brands ? 
                    Object.entries(aggregations.brands).map(([name, count]) => ({
                      label: `${name} (${count})`,
                      value: name
                    })) : []
                  }
                  value={filters.brands}
                  onChange={(value) => handleFilterChange('brands', value)}
                  className="w-full"
                />
              )}
            </div>

            {/* Location */}
            <div className="border-b pb-4 mb-4">
              <button
                onClick={() => toggleSection('location')}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <span className="font-medium">Location</span>
                {expandedSections.has('location') ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>
              {expandedSections.has('location') && (
                <div className="space-y-2">
                  <Select
                    options={aggregations?.states ? 
                      Object.keys(aggregations.states).map(state => ({
                        label: state,
                        value: state
                      })) : []
                    }
                    value={filters.state}
                    onChange={(value) => handleFilterChange('state', value)}
                    placeholder="Select State"
                    className="w-full mb-2"
                  />
                  <Select
                    options={aggregations?.cities ? 
                      Object.keys(aggregations.cities).map(city => ({
                        label: city,
                        value: city
                      })) : []
                    }
                    value={filters.city}
                    onChange={(value) => handleFilterChange('city', value)}
                    placeholder="Select City"
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="border-b pb-4 mb-4">
              <button
                onClick={() => toggleSection('rating')}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <span className="font-medium">Rating</span>
                {expandedSections.has('rating') ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>
              {expandedSections.has('rating') && (
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <Checkbox
                        checked={filters.minRating === rating}
                        onChange={() => handleFilterChange('minRating', rating)}
                      />
                      <span className="ml-2">{rating}+ Stars</span>
                      {aggregations?.ratings && (
                        <span className="ml-auto text-gray-500">
                          ({aggregations.ratings[`${rating}+ Stars`] || 0})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              <div className="flex items-center">
                <Checkbox
                  checked={filters.inStockOnly}
                  onChange={(checked) => handleFilterChange('inStockOnly', checked)}
                />
                <span className="ml-2">In Stock Only</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Results */}
      <div className="flex-1">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                placeholder="Search products, brands, or categories..."
                className="pl-10"
              />
              <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Select
              options={[
                { label: 'Relevance', value: 'relevance' },
                { label: 'Price: Low to High', value: 'price_asc' },
                { label: 'Price: High to Low', value: 'price_desc' },
                { label: 'Rating', value: 'rating' },
                { label: 'Most Recent', value: 'recent' }
              ]}
              value={filters.sortBy + (filters.sortBy === 'price' ? '_' + filters.sortOrder : '')}
              onChange={(value) => {
                const stringValue = typeof value === 'string' ? value : (value as any)?.target?.value;
                if (stringValue === 'price_asc') {
                  handleFilterChange('sortBy', 'price');
                  handleFilterChange('sortOrder', 'asc');
                } else if (stringValue === 'price_desc') {
                  handleFilterChange('sortBy', 'price');
                  handleFilterChange('sortOrder', 'desc');
                } else {
                  handleFilterChange('sortBy', stringValue);
                }
              }}
              className="w-48"
            />
          </div>
        </div>

        {/* Active Filters */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {filters.categories.map((category) => (
              <div
                key={category}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                <span>{category}</span>
                <button
                  onClick={() => handleFilterChange(
                    'categories',
                    filters.categories.filter(c => c !== category)
                  )}
                  className="ml-1"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            {filters.brands.map((brand) => (
              <div
                key={brand}
                className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                <span>{brand}</span>
                <button
                  onClick={() => handleFilterChange(
                    'brands',
                    filters.brands.filter(b => b !== brand)
                  )}
                  className="ml-1"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            {Object.entries(filters.specifications).map(([key, values]) =>
              values.map((value) => (
                <div
                  key={`${key}-${value}`}
                  className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  <span>{key}: {value}</span>
                  <button
                    onClick={() => handleSpecificationChange(
                      key,
                      values.filter(v => v !== value)
                    )}
                    className="ml-1"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
            {filters.minRating && (
              <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center">
                <span>{filters.minRating}+ Stars</span>
                <button
                  onClick={() => handleFilterChange('minRating', null)}
                  className="ml-1"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            {(filters.city || filters.state) && (
              <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm flex items-center">
                <span>{[filters.city, filters.state].filter(Boolean).join(', ')}</span>
                <button
                  onClick={() => {
                    handleFilterChange('city', '');
                    handleFilterChange('state', '');
                  }}
                  className="ml-1"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Results will be rendered here */}
      </div>
    </div>
  );
};

export default AdvancedProductSearch;
