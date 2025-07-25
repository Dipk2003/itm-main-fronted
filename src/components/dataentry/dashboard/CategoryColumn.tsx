'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, ChevronDown, ChevronRight, Edit, Trash2, Folder, FolderOpen } from 'lucide-react';
import { DataEntryService, Category, CreateCategoryDto, UpdateCategoryDto } from '@/services/dataEntryService';

interface CategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
}

const CategoryColumn: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    isActive: true
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setInitialLoading(true);
      const response = await DataEntryService.getAllCategories('', { page: 0, size: 100 });
      setCategories(response.content || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setInitialLoading(false);
    }
  };

  // Filter categories based on search and status
  const filteredCategories = useMemo(() => {
    if (!categories || !Array.isArray(categories)) {
      return [];
    }
    let filtered = categories;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(category => 
        statusFilter === 'active' ? category.isActive : !category.isActive
      );
    }

    return filtered;
  }, [categories, searchQuery, statusFilter]);

  const handleAddCategory = async () => {
    if (!formData.name.trim()) return;

    try {
      setLoading(true);
      const categoryData: CreateCategoryDto = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive,
        displayOrder: categories.length + 1
      };

      await DataEntryService.createCategory(categoryData);
      setShowAddModal(false);
      setFormData({ name: '', description: '', isActive: true });
      fetchCategories(); // Refresh categories
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !formData.name.trim()) return;

    try {
      setLoading(true);
      const categoryData: UpdateCategoryDto = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive,
        displayOrder: editingCategory.displayOrder
      };

      await DataEntryService.updateCategory(editingCategory.id, categoryData);
      setEditingCategory(null);
      setFormData({ name: '', description: '', isActive: true });
      fetchCategories(); // Refresh categories
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"? This will also delete all subcategories and products under it.`)) {
      return;
    }

    try {
      setLoading(true);
      await DataEntryService.deleteCategory(category.id);
      if (selectedCategory?.id === category.id) {
        setSelectedCategory(null);
      }
      fetchCategories(); // Refresh categories
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', isActive: true });
  };

  const handleCategoryClick = (category: Category) => {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Folder className="w-4 h-4" />
          <span className="font-medium">Categories ({filteredCategories.length})</span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-700 hover:bg-blue-800 px-2 py-1 rounded text-sm flex items-center space-x-1"
          disabled={loading}
        >
          <Plus className="w-3 h-3" />
          <span>Add</span>
        </button>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <Folder className="w-8 h-8 mb-2" />
            <p className="text-sm">No categories found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedCategory?.id === category.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1" onClick={() => handleCategoryClick(category)}>
                    {selectedCategory?.id === category.id ? (
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 truncate">{category.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          category.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-600 truncate mt-1">{category.description}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                        <span>{category.subCategoryCount} subcategories</span>
                        <span>•</span>
                        <span>{category.totalProductCount} products</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(category);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      disabled={loading}
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      disabled={loading}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingCategory) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter category description"
                  disabled={loading}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                  disabled={loading}
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={editingCategory ? handleEditCategory : handleAddCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={loading || !formData.name.trim()}
              >
                {loading ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryColumn;
