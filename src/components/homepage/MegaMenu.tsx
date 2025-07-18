'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { categoryAPI, Category } from '@/lib/categoryApi';
import { productAPI, Product } from '@/lib/productApi';
import { useRouter } from 'next/navigation';

// Import MegaMenu assets
import mm1 from '@/assets/MegaMenu/mm1.png';
import mm2 from '@/assets/MegaMenu/mm2.png';
import mm3 from '@/assets/MegaMenu/mm3.png';
import mm4 from '@/assets/MegaMenu/mm4.png';
import mm5 from '@/assets/MegaMenu/mm5.png';
import mm6 from '@/assets/MegaMenu/mm6.png';

// Import category components
import {
  BuildingConstructionMenu,
  ElectronicsMenu,
  PharmaMenu,
  AutomobileMenu,
  ApparelMenu,
  AgricultureMenu,
} from '@/components/MegaMenu';

// Types
interface MenuCategory {
  id: string;
  title: string;
  icon: any;
  component: React.ComponentType;
  description?: string;
  itemCount?: number;
}

// Menu configuration data
const menuData: MenuCategory[] = [
  {
    id: 'building-construction',
    title: 'Building & Construction',
    icon: mm1,
    component: BuildingConstructionMenu,
    description: 'Wood, Steel, Roofing & Construction Materials',
    itemCount: 150
  },
  {
    id: 'electronics-electrical',
    title: 'Electronics & Electrical',
    icon: mm2,
    component: ElectronicsMenu,
    description: 'Solar, Lighting, Batteries & Home Appliances',
    itemCount: 200
  },
  {
    id: 'drugs-pharma',
    title: 'Drugs & Pharma',
    icon: mm3,
    component: PharmaMenu,
    description: 'Medicines, Ayurvedic & Healthcare Products',
    itemCount: 300
  },
  {
    id: 'automobile',
    title: 'Automobile',
    icon: mm4,
    component: AutomobileMenu,
    description: 'Car Parts, Motorcycle & Auto Equipment',
    itemCount: 180
  },
  {
    id: 'apparel-fashion',
    title: 'Apparel & Fashion',
    icon: mm5,
    component: ApparelMenu,
    description: 'Clothing, Footwear & Fashion Accessories',
    itemCount: 250
  },
  {
    id: 'agriculture',
    title: 'Agriculture & Food',
    icon: mm6,
    component: AgricultureMenu,
    description: 'Seeds, Fertilizers & Farm Equipment',
    itemCount: 120
  }
];

const MegaMenu: React.FC = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await categoryAPI.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchData();
  }, []);

  const handleMouseEnter = (categoryId: string) => {
    setActiveCategory(categoryId);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
    setIsHovering(false);
  };

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to category page
    router.push(`/categories/${categoryId}`);
  };

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
            {menuData.map((category) => {
              const CategoryComponent = category.component;
              const isActive = activeCategory === category.id;

              // Fetch vendor products by category
              useEffect(() => {
                if (activeCategory) {
                  const fetchVendorProducts = async () => {
                    try {
                      const productsData = await productAPI.getProductsByCategory(Number(activeCategory));
                      setVendorProducts(productsData.content);
                    } catch (error) {
                      console.error('Error fetching vendor products:', error);
                    }
                  };
                  fetchVendorProducts();
                }
              }, [activeCategory]);

              return (
                <div
                  key={category.id}
                  className="group relative h-full"
                  onMouseEnter={() => handleMouseEnter(category.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Category Button */}
                  <button 
                    onClick={() => handleCategoryClick(category.id)}
                    className={`flex flex-col items-center justify-between w-full h-full min-h-[160px] sm:min-h-[180px] md:min-h-[200px] p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 ${isActive ? 'border-indigo-200 shadow-lg' : 'hover:border-indigo-200'} group`}
                  >
                    <div className="flex flex-col items-center space-y-3 w-full flex-1 justify-center">
                      {/* Icon */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full flex items-center justify-center group-hover:from-indigo-100 group-hover:to-blue-100 transition-all duration-300">
                          <Image
                            src={category.icon}
                            alt={category.title}
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
                      <div className="text-center flex-1 flex flex-col justify-center">
                        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-tight mb-1">
                          {category.title}
                        </h3>
                        {category.description && (
                          <p className="text-xs text-gray-500 mt-1 group-hover:text-indigo-500 transition-colors duration-300 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                            {category.description}
                          </p>
                        )}
                        {category.itemCount && (
                          <span className="inline-block mt-2 text-xs text-indigo-600 font-medium">
                            {category.itemCount}+ items
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Chevron - Always at bottom */}
                    <div className="flex-shrink-0 mt-2">
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
              <a
                href="/categories"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                View All Categories
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
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
                  {(() => {
                    const category = menuData.find(cat => cat.id === activeCategory);
                    if (!category) return null;
                    const CategoryComponent = category.component;

                    return (
                      <>
                        {/* Category Header */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                          <div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900">{category.title}</h3>
                            {category.description && (
                              <p className="text-sm md:text-base text-gray-600 mt-1">{category.description}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm md:text-base text-gray-500">View All</span>
                            <ChevronDownIcon className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
                          </div>
                        </div>

                        {/* Category Content */}
                        <div className="min-h-[400px] md:min-h-[450px] overflow-visible">
                          <CategoryComponent />
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MegaMenu;
