'use client';

import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { Search, User, LogOut, Settings, ShoppingCart, BarChart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';

export function Navbar() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'ADMIN';
  const isVendor = user?.role === 'VENDOR';
  const isUser = user?.role === 'USER';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full px-4 py-3 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity flex-shrink-0">
            <img src="/logo.png" alt="Indian Trade Mart" className="h-8 w-auto" />
            <div className="text-xl font-bold hidden sm:block">Indian Trade Mart</div>
          </a>
          
          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <SearchBar placeholder="Search products, categories, vendors..." />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <button
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                setUserDropdownOpen(false);
                setVendorDropdownOpen(false);
              }}
              className={`md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                mobileSearchOpen ? 'bg-gray-100' : ''
              }`}
            >
              <Search size={20} className="text-gray-600" />
            </button>
            
            <div className="text-sm space-x-6 text-gray-700 flex items-center flex-shrink-0">
              <a href="/" className="hover:text-blue-600 transition-colors hidden sm:block">Home</a>
          
              {isAuthenticated ? (
                // Authenticated user navigation
                <>
                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(!userDropdownOpen);
                        setVendorDropdownOpen(false);
                        setMobileSearchOpen(false);
                      }}
                      className="flex items-center space-x-2 hover:text-blue-600 transition-colors focus:outline-none"
                    >
                      <User size={16} />
                      <span className="hidden sm:inline">{user?.name || 'User'}</span>
                    </button>
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        {isVendor && (
                          <>
                            <a
                              href="/dashboard/vendor"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <BarChart size={16} className="mr-2" />
                              Dashboard
                            </a>
                            <a
                              href="/products-you-buy"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <ShoppingCart size={16} className="mr-2" />
                              Products
                            </a>
                          </>
                        )}
                        {isUser && (
                          <>
                            <a
                              href="/dashboard/user"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <BarChart size={16} className="mr-2" />
                              Dashboard
                            </a>
                            <a
                              href="/products-you-buy"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <ShoppingCart size={16} className="mr-2" />
                              Products
                            </a>
                          </>
                        )}
                        {isAdmin && (
                          <>
                            <a
                              href="/dashboard/admin"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <BarChart size={16} className="mr-2" />
                              Admin Dashboard
                            </a>
                          </>
                        )}
                        <a
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Settings size={16} className="mr-2" />
                          Profile Settings
                        </a>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            dispatch(logout());
                            router.push('/');
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Non-authenticated user navigation
                <>
                  {/* User/Buyer Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(!userDropdownOpen);
                        setVendorDropdownOpen(false);
                        setMobileSearchOpen(false);
                      }}
                      className="hover:text-blue-600 transition-colors focus:outline-none"
                    >
                      Buyer/User
                    </button>
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <a
                          href="/auth/user/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          Login
                        </a>
                        <a
                          href="/auth/user/register"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          Register
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {/* Vendor Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setVendorDropdownOpen(!vendorDropdownOpen);
                        setUserDropdownOpen(false);
                        setMobileSearchOpen(false);
                      }}
                      className="hover:text-blue-600 transition-colors focus:outline-none"
                    >
                      Vendor
                    </button>
                    {vendorDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <a
                          href="/auth/vendor/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setVendorDropdownOpen(false)}
                        >
                          Login
                        </a>
                        <a
                          href="/auth/vendor/register"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setVendorDropdownOpen(false)}
                        >
                          Register
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden mt-4 pb-4">
            <SearchBar placeholder="Search products, categories, vendors..." />
          </div>
        )}
      </div>
      
      {/* Click outside to close dropdowns */}
      {(userDropdownOpen || vendorDropdownOpen) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setUserDropdownOpen(false);
            setVendorDropdownOpen(false);
          }}
        />
      )}
    </nav>
  );
}
