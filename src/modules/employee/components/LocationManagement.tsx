'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Select } from '@/shared/components/Select';
import LocationTable from './LocationTable';
import LocationForm from './LocationForm';
import { 
  getAllStates, 
  getStatesPaginated,
  getCitiesPaginated,
  getCitiesByState,
  searchStates,
  searchCities,
  deleteState,
  deleteCity,
  toggleStateStatus,
  toggleCityStatus
} from '../services/locationManagementApi';
import { State, City } from '../types/employee';

export default function LocationManagement() {
  const [activeTab, setActiveTab] = useState<'states' | 'cities'>('states');
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [allStates, setAllStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateId, setSelectedStateId] = useState<string>('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<State | City | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'state' | 'city' } | null>(null);

  const loadAllStates = React.useCallback(async () => {
    try {
      const data = await getAllStates();
      setAllStates(data);
    } catch (error) {
      console.error('Failed to load states:', error);
    }
  }, []);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'states') {
        const result = await getStatesPaginated(page, size, searchQuery || undefined);
        setStates(result.content);
        setTotalElements(result.totalElements);
        setTotalPages(result.totalPages);
      } else {
        const result = await getCitiesPaginated(page, size, selectedStateId || undefined, searchQuery || undefined);
        setCities(result.content);
        setTotalElements(result.totalElements);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, size, selectedStateId, searchQuery]);

  useEffect(() => {
    loadAllStates();
    loadData();
  }, [loadAllStates, loadData]);

  useEffect(() => {
    loadData();
  }, [activeTab, page, size, selectedStateId, loadData]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setPage(0);
      
      if (activeTab === 'states') {
        const data = await searchStates(searchQuery);
        setStates(data);
      } else {
        const data = await searchCities(searchQuery, selectedStateId || undefined);
        setCities(data);
      }
    } catch (error) {
      console.error('Failed to search:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStateId('');
    setPage(0);
    loadData();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: State | City) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
    loadData();
    loadAllStates();
  };

  const handleDeleteClick = (itemId: string, type: 'state' | 'city') => {
    setItemToDelete({ id: itemId, type });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        if (itemToDelete.type === 'state') {
          await deleteState(itemToDelete.id);
        } else {
          await deleteCity(itemToDelete.id);
        }
        loadData();
        loadAllStates();
      } catch (error) {
        console.error('Failed to delete:', error);
      } finally {
        setShowDeleteConfirm(false);
        setItemToDelete(null);
      }
    }
  };

  const handleToggleStatus = async (itemId: string, type: 'state' | 'city') => {
    try {
      if (type === 'state') {
        await toggleStateStatus(itemId);
      } else {
        await toggleCityStatus(itemId);
      }
      loadData();
      loadAllStates();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleTabChange = (tab: 'states' | 'cities') => {
    setActiveTab(tab);
    setPage(0);
    setSearchQuery('');
    setSelectedStateId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Location Management</h2>
          <p className="text-gray-600 mt-1">Manage states and cities that appear in location dropdowns</p>
        </div>
        <Button onClick={handleAddNew}>
          ➕ Add New {activeTab === 'states' ? 'State' : 'City'}
        </Button>
      </div>

      {/* Tabs */}
      <Card className="p-1">
        <div className="flex space-x-1">
          <button
            onClick={() => handleTabChange('states')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'states'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🏛️ States ({allStates.length})
          </button>
          <button
            onClick={() => handleTabChange('cities')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'cities'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🏙️ Cities
          </button>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              label="Search"
            />
          </div>
          
          {activeTab === 'cities' && (
            <div className="w-full md:w-64">
              <Select
                label="Filter by State"
                value={selectedStateId}
                onChange={(e) => setSelectedStateId(e.target.value)}
                options={[
                  { value: '', label: 'All States' },
                  ...(allStates.map(state => ({ value: state.id, label: state.name })))
                ]}
              />
            </div>
          )}
          
          <div className="flex items-end space-x-2">
            <Button onClick={handleSearch} variant="secondary">
              🔍 Search
            </Button>
            <Button onClick={handleClearFilters} variant="outline">
              ↻ Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Location Table */}
      <LocationTable
        data={activeTab === 'states' ? states : cities}
        type={activeTab}
        loading={loading}
        page={page}
        size={size}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={(id) => handleDeleteClick(id, activeTab === 'states' ? 'state' : 'city')}
        onToggleStatus={(id) => handleToggleStatus(id, activeTab === 'states' ? 'state' : 'city')}
        allStates={allStates}
      />

      {/* Location Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {editingItem 
                    ? `Edit ${activeTab === 'states' ? 'State' : 'City'}` 
                    : `Add New ${activeTab === 'states' ? 'State' : 'City'}`
                  }
                </h3>
                <button
                  onClick={handleFormClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <LocationForm
                item={editingItem}
                type={activeTab === 'states' ? 'state' : 'city'}
                onClose={handleFormClose}
                states={allStates}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this {itemToDelete?.type}? 
              {itemToDelete?.type === 'state' && ' This will also delete all cities in this state.'}
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setItemToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
