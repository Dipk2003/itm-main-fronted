'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Ticket, ChevronDown, Search, Filter, Plus, Clock, User, AlertCircle } from 'lucide-react';

interface SupportTicket {
  id: number;
  ticketNumber: string;
  subject: string;
  description: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  user: {
    id: number;
    name: string;
    email: string;
  };
  assignedTo?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  response?: string;
  assignedAt?: string;
}

interface TicketFilters {
  status: string;
  priority: string;
  category: string;
  search: string;
}

const TicketManagement = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [filters, setFilters] = useState<TicketFilters>({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showTicketDetail, setShowTicketDetail] = useState(false);

  // Fetch tickets from backend
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/api/support-tickets');
      setTickets(response.data);
      setFilteredTickets(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tickets based on current filters
  useEffect(() => {
    let filtered = tickets;

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.ticketNumber.toLowerCase().includes(searchTerm) ||
        ticket.subject.toLowerCase().includes(searchTerm) ||
        ticket.user.name.toLowerCase().includes(searchTerm) ||
        ticket.user.email.toLowerCase().includes(searchTerm) ||
        (ticket.assignedTo?.name || '').toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === filters.priority);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === filters.category);
    }

    setFilteredTickets(filtered);
  }, [tickets, filters]);

  const handleFilterChange = (key: keyof TicketFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTicketClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowTicketDetail(true);
  };

  const updateTicketStatus = async (ticketId: number, newStatus: string, assignedToId?: number) => {
    try {
      const response = await api.put(`/api/support-tickets/${ticketId}/status`, {
        status: newStatus,
        assignedToId
      });
      
      // Update local state
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, ...response.data } : ticket
      ));
      
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(response.data);
      }
    } catch (err: any) {
      console.error('Error updating ticket status:', err);
      setError(err.response?.data?.message || 'Failed to update ticket status');
    }
  };

  const assignTicket = async (ticketId: number, assigneeId: number) => {
    try {
      const response = await api.patch(`/api/support-tickets/${ticketId}/assign`, {
        assigneeId
      });
      
      // Update local state
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, ...response.data } : ticket
      ));
      
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(response.data);
      }
    } catch (err: any) {
      console.error('Error assigning ticket:', err);
      setError(err.response?.data?.message || 'Failed to assign ticket');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(tickets.map(ticket => ticket.category))];
    return categories.filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchTickets}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Ticket Management</h2>
            <span className="text-sm text-gray-500">({filteredTickets.length} tickets)</span>
          </div>
          <button 
            onClick={() => {/* TODO: Implement new ticket creation */}}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Category Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {getUniqueCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="divide-y divide-gray-200">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Ticket className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">No tickets found</p>
            <p>No tickets match your current filters.</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleTicketClick(ticket)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-medium text-gray-900">
                      {ticket.ticketNumber}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    {ticket.category && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {ticket.category}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2 truncate">
                    {ticket.subject}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Customer: {ticket.user.name}</span>
                    </div>
                    
                    {ticket.assignedTo && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Assigned: {ticket.assignedTo.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Created: {formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>
                  
                  {ticket.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {ticket.description}
                    </p>
                  )}
                </div>
                
                <ChevronDown className="h-5 w-5 text-gray-400 ml-4 flex-shrink-0" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ticket Detail Modal/Panel (Optional - for future implementation) */}
      {showTicketDetail && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Ticket Details</h3>
                <button
                  onClick={() => setShowTicketDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Ticket Number</label>
                  <p className="mt-1 font-mono">{selectedTicket.ticketNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <p className="mt-1">{selectedTicket.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status.replace('_', ' ')}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <p className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Customer</label>
                  <p className="mt-1">{selectedTicket.user.name} ({selectedTicket.user.email})</p>
                </div>
                {selectedTicket.assignedTo && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Assigned To</label>
                    <p className="mt-1">{selectedTicket.assignedTo.name} ({selectedTicket.assignedTo.email})</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">Created At</label>
                  <p className="mt-1">{formatDate(selectedTicket.createdAt)}</p>
                </div>
                {selectedTicket.response && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Response</label>
                    <p className="mt-1 whitespace-pre-wrap">{selectedTicket.response}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManagement;
