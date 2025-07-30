'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { inquiryApi } from '@/services/api/inquiryApi';

interface InquiryFormProps {
  productId: string;
  productName: string;
  vendorId?: string;
  onSuccess?: () => void;
}

interface InquiryData {
  productName: string;
  message: string;
  quantity: number;
  budget: number;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ 
  productId, 
  productName, 
  vendorId,
  onSuccess 
}) => {
  const [inquiryData, setInquiryData] = useState<InquiryData>({
    productName: productName,
    message: '',
    quantity: 1,
    budget: 0
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInquiryData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'budget' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await inquiryApi.createInquiry({
        productId,
        vendorId,
        ...inquiryData
      });
      
      setSuccess(true);
      setInquiryData({
        productName: productName,
        message: '',
        quantity: 1,
        budget: 0
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating inquiry:', error);
      alert('Failed to create inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="text-green-600 text-lg font-semibold mb-2">
            ✓ Inquiry Sent Successfully!
          </div>
          <p className="text-green-700">
            Your inquiry has been sent to the vendor. They will contact you soon.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Send Inquiry
        </CardTitle>
        <p className="text-sm text-gray-600">
          Get the best quote for this product
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <Input
              type="text"
              name="productName"
              value={inquiryData.productName}
              onChange={handleInputChange}
              placeholder="Product name"
              required
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity Required
            </label>
            <Input
              type="number"
              name="quantity"
              value={inquiryData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget (₹)
            </label>
            <Input
              type="number"
              name="budget"
              value={inquiryData.budget}
              onChange={handleInputChange}
              placeholder="Enter your budget"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={inquiryData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tell us about your requirements..."
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Inquiry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InquiryForm;
