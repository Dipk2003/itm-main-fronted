'use client';

import React, { useState, useEffect } from 'react';
import { orderApi, Order } from '@/services/api/orderApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const statusColors: Record<string, string> = {
    'PENDING': 'yellow',
    'CONFIRMED': 'green',
    'PROCESSING': 'blue',
    'SHIPPED': 'purple',
    'DELIVERED': 'gray',
    'CANCELLED': 'red'
  };

  useEffect(() => {
    loadOrders();
  }, [page, size]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getVendorOrders(page, size);
      setOrders(response.content);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await orderApi.updateOrderStatus(orderId, status);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center w-full h-full">
            Loading orders...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Status</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>
                    <Badge color={statusColors[order.status]}>{order.status}</Badge>
                  </td>
                  <td>{order.grandTotal.toFixed(2)}</td>
                  <td>
                    <Select value="" onChange={(e) => updateOrderStatus(order.id, e.target.value)}>
                      <option value="">Change Status</option>
                      {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={orders.length < size}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default OrderManagement;
