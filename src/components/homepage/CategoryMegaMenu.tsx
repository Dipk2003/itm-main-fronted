'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { categoryAPI, Category, SubCategory } from '@/lib/categoryApi';
import { productAPI, Product } from '@/lib/productApi';

// Import MegaMenu assets
import mm1 from '@/assets/MegaMenu/mm1.png';
import mm2 from '@/assets/MegaMenu/mm2.png';
import mm3 from '@/assets/MegaMenu/mm3.png';
import mm4 from '@/assets/MegaMenu/mm4.png';
import mm5 from '@/assets/MegaMenu/mm5.png';
import mm6 from '@/assets/MegaMenu/mm6.png';

// Category with icon mapping
interface CategoryWithIcon extends Category {
  icon: any;
  subcategories?: SubCategory[];
  products?: Product[];
}

// Icon mapping for categories
const categoryIcons: Record<string, any> = {
  'Building Construction': mm1,
  'Electronics': mm2,
  'Healthcare': mm3,
  'Automobile': mm4,
  'Apparel': mm5,
  'Agriculture': mm6,
};

const CategoryMegaMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<CategoryWithIcon[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryAPI.getAllCategories();
        const categoriesWithIcons = categoriesData.map((cat) => ({
          ...cat,
          icon: categoryIcons[cat.name] || mm1,
        }));
        setCategories(categoriesWithIcons);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories and products when category changes
  useEffect(() => {
    if (activeCategory) {
      const fetchCategoryData = async () => {
        try {
          // Fetch subcategories
          const subcategoriesData = await categoryAPI.getSubCategoriesByCategory(activeCategory);
          setSubcategories(subcategoriesData);

          // Fetch products for this category
          const productsData = await productAPI.getProductsByCategory(activeCategory);
          setCategoryProducts(productsData.content || []);
        } catch (error) {
          console.error('Error fetching category data:', error);
        }
      };
      fetchCategoryData();
    }
  }, [activeCategory]);

  const handleMouseEnter = (categoryId: number) => {
    setActiveCategory(categoryId);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading categories...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <section className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover thousands of products from verified suppliers across India's top business categories
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 lg:gap-8">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <div
                  key={category.id}
                  className="group relative"
                  onMouseEnter={() => handleMouseEnter(category.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Category Button */}
                  <button className={`flex flex-col items-center justify-center w-full p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 ${isActive ? 'border-indigo-200 shadow-lg' : 'hover:border-indigo-200'} group`}>
                    <div className="flex flex-col items-center space-y-3 w-full">
                      {/* Icon */}
                      <div className="relative">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full flex items-center justify-center group-hover:from-indigo-100 group-hover:to-blue-100 transition-all duration-300">
                          <Image
                            src={category.icon}
                            alt={category.name}
                            width={48}
                            height={48}
                            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      
                      {/* Title */}
                      <div className="text-center">
                        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-tight">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-xs text-gray-500 mt-1 group-hover:text-indigo-500 transition-colors duration-300">
                            {category.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Chevron */}
                      <ChevronDownIcon className={`w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-all duration-300 ${isActive ? 'rotate-180' : 'group-hover:rotate-180'}`} />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* View All Categories Link - Hide when any category is active */}
          {!activeCategory && (
            <div className="text-center mt-12">
              <Link
                href="/categories"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                View All Categories
                <ArrowRightIcon className="ml-2 -mr-1 w-5 h-5" />
              </Link>
            </div>
          )}

          {/* Mega Menu Dropdown - Positioned directly under cards */}
          {activeCategory && (
            <div 
              className="w-full bg-white border border-gray-200 rounded-xl shadow-xl mt-8"
              onMouseEnter={() => handleMouseEnter(activeCategory)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-7xl mx-auto px-4">
                <div className="p-6 md:p-8">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                        {categories.find(cat => cat.id === activeCategory)?.name}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 mt-1">
                        {categories.find(cat => cat.id === activeCategory)?.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm md:text-base text-gray-500">View All</span>
                      <ChevronDownIcon className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
                    </div>
                  </div>

                  {/* Subcategories and Products Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="space-y-3">
                        <div className="border-b border-gray-200 pb-2">
                          <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2">
                            {subcategory.name}
                          </h4>
                          <div className="space-y-2">
                            {categoryProducts
                              .filter(product => product.subCategory?.id === subcategory.id)
                              .slice(0, 8)
                              .map((product) => (
                                <Link
                                  key={product.id}
                                  href={`/products/${product.id}`}
                                  className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                                >
                                  {product.name}
                                </Link>
                              ))}
                          </div>
                        </div>
                        
                        {/* Vendor Information */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-indigo-600">V</span>
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              {categoryProducts
                                .filter(product => product.subCategory?.id === subcategory.id)
                                .slice(0, 1)
                                .map(product => product.vendor?.name || 'Vendor')
                                .join('')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {categoryProducts
                              .filter(product => product.subCategory?.id === subcategory.id)
                              .length} products available
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Featured Products Section */}
                  {categoryProducts.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Featured Products</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categoryProducts.slice(0, 6).map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="group block bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                          >
                            <div className="aspect-square bg-white rounded-lg mb-2 flex items-center justify-center">
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  src={product.images[0].imageUrl}
                                  alt={product.name}
                                  width={60}
                                  height={60}
                                  className="w-full h-full object-contain rounded-lg"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">No Image</span>
                                </div>
                              )}
                            </div>
                            <h5 className="text-xs font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                              {product.name}
                            </h5>
                            <p className="text-xs text-gray-600 mt-1">
                              ₹{product.price.toLocaleString()}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryMegaMenu;
