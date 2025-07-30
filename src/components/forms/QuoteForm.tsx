import React, { useState } from 'react';
import { quoteApi, CreateQuoteRequest } from '@/services/api/quoteApi';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface QuoteFormProps {
  inquiryId: number;
  vendorId: number;
  inquiryMessage: string;
  productName: string;
  buyerName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function QuoteForm({
  inquiryId,
  vendorId,
  inquiryMessage,
  productName,
  buyerName,
  onSuccess,
  onCancel
}: QuoteFormProps) {
  const [quoteData, setQuoteData] = useState<CreateQuoteRequest>({
    vendorId,
    inquiryId,
    response: '',
    price: undefined,
    currency: 'INR',
    quantity: undefined,
    deliveryTime: '',
    paymentTerms: '',
    validityPeriod: '30 days',
    additionalNotes: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuoteData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? (value ? Number(value) : undefined) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quoteData.response.trim()) {
      alert('Please enter your response message');
      return;
    }

    setLoading(true);
    try {
      await quoteApi.createQuote(quoteData);
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error: any) {
      console.error('Error creating quote:', error);
      alert('Failed to send quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="text-green-600 text-lg font-semibold mb-2">
            ✓ Quote Sent Successfully!
          </div>
          <p className="text-green-700">
            Your quote has been sent to {buyerName}. They will be notified via email.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Send Quote
        </CardTitle>
        <p className="text-sm text-gray-600">
          Product: <strong>{productName}</strong> • Buyer: <strong>{buyerName}</strong>
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm font-medium text-gray-700 mb-1">Original Inquiry:</p>
          <p className="text-sm text-gray-600">{inquiryMessage}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Response *
            </label>
            <textarea
              name="response"
              value={quoteData.response}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your product/service offering..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <Input
                type="number"
                name="price"
                value={quoteData.price || ''}
                onChange={handleInputChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <Input
                type="number"
                name="quantity"
                value={quoteData.quantity || ''}
                onChange={handleInputChange}
                placeholder="Enter quantity"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Time
              </label>
              <Input
                type="text"
                name="deliveryTime"
                value={quoteData.deliveryTime}
                onChange={handleInputChange}
                placeholder="e.g., 15-20 days"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms
              </label>
              <select
                name="paymentTerms"
                value={quoteData.paymentTerms}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select payment terms</option>
                <option value="Advance Payment">100% Advance Payment</option>
                <option value="50% Advance">50% Advance, 50% on Delivery</option>
                <option value="30% Advance">30% Advance, 70% on Delivery</option>
                <option value="Against Delivery">Against Delivery</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Custom">Custom Terms</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quote Validity
            </label>
            <select
              name="validityPeriod"
              value={quoteData.validityPeriod}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7 days">7 Days</option>
              <option value="15 days">15 Days</option>
              <option value="30 days">30 Days</option>
              <option value="60 days">60 Days</option>
              <option value="90 days">90 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              name="additionalNotes"
              value={quoteData.additionalNotes}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any additional terms, conditions, or notes..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Sending Quote...' : 'Send Quote'}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
