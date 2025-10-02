'use client';

import React, { useState, useEffect } from 'react';
import { orderAPI, type Order } from '@/shared/services';
import { Card, Button, Select, Badge } from '@/shared/components';

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

  const loadOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getVendorOrders({ page, size });
      setOrders(response.content);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await orderAPI.updateStatus(orderId, { status } as any);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center w-full h-full">
          Loading orders...
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Management</h2>
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
                  <td>₹{order.finalAmount.toFixed(2)}</td>
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
