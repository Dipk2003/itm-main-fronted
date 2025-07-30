import React, { useEffect, useState } from 'react';
import { inquiryApi, Inquiry } from '@/services/api/inquiryApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function VendorInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [unresolvedInquiries, setUnresolvedInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unresolved'>('unresolved');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const [allInquiries, unresolved] = await Promise.all([
        inquiryApi.getVendorInquiries(0, 50),
        inquiryApi.getUnresolvedInquiries()
      ]);
      
      setInquiries(allInquiries.content || allInquiries);
      setUnresolvedInquiries(unresolved);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkResolved = async (inquiryId: number) => {
    try {
      await inquiryApi.markAsResolved(inquiryId);
      // Refresh the data
      fetchInquiries();
    } catch (error) {
      console.error('Error marking inquiry as resolved:', error);
      alert('Failed to mark as resolved');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentInquiries = activeTab === 'unresolved' ? unresolvedInquiries : inquiries;

  if (loading) {
    return <div className="text-center">Loading inquiries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Inquiries</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => setActiveTab('unresolved')}
            variant={activeTab === 'unresolved' ? 'default' : 'outline'}
          >
            Unresolved ({unresolvedInquiries.length})
          </Button>
          <Button
            onClick={() => setActiveTab('all')}
            variant={activeTab === 'all' ? 'default' : 'outline'}
          >
            All Inquiries ({inquiries.length})
          </Button>
        </div>
      </div>

      {currentInquiries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {activeTab === 'unresolved' 
                ? 'No unresolved inquiries found.' 
                : 'No inquiries found.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {currentInquiries.map((inquiry) => (
            <Card key={inquiry.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {inquiry.product.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      From: {inquiry.user.name} ({inquiry.user.email})
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(inquiry.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inquiry.isResolved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inquiry.isResolved ? 'Resolved' : 'Pending'}
                    </span>
                    {!inquiry.isResolved && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkResolved(inquiry.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{inquiry.message}</p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline">
                    Send Quote
                  </Button>
                  <Button size="sm" variant="outline">
                    Contact Buyer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
