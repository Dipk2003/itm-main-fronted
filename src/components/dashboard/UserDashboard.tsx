'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  HeartIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  TicketIcon,
  ShoppingCartIcon,
  StarIcon,
  TrendingUpIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  wishlistCount: number;
  inquiriesCount: number;
  reviewsCount: number;
  ticketsCount: number;
  ordersCount: number;
}

interface RecentActivity {
  id: string;
  type: 'inquiry' | 'review' | 'ticket' | 'wishlist';
  title: string;
  description: string;
  date: string;
  status?: string;
}

const UserDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    wishlistCount: 0,
    inquiriesCount: 0,
    reviewsCount: 0,
    ticketsCount: 0,
    ordersCount: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }

      // Fetch dashboard stats (parallel requests)
      const [wishlistRes, inquiriesRes, reviewsRes, ticketsRes] = await Promise.allSettled([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/count`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiries/count`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/count`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support/tickets/count`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      // Parse responses
      const newStats = { ...stats };
      
      if (wishlistRes.status === 'fulfilled' && wishlistRes.value.ok) {
        const data = await wishlistRes.value.json();
        newStats.wishlistCount = data.count || 0;
      }
      
      if (inquiriesRes.status === 'fulfilled' && inquiriesRes.value.ok) {
        const data = await inquiriesRes.value.json();
        newStats.inquiriesCount = data.count || 0;
      }
      
      if (reviewsRes.status === 'fulfilled' && reviewsRes.value.ok) {
        const data = await reviewsRes.value.json();
        newStats.reviewsCount = data.count || 0;
      }
      
      if (ticketsRes.status === 'fulfilled' && ticketsRes.value.ok) {
        const data = await ticketsRes.value.json();
        newStats.ticketsCount = data.count || 0;
      }

      setStats(newStats);

      // Fetch recent activities
      const activitiesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/activities`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setRecentActivities(activitiesData);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'inquiry':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'review':
        return <StarIcon className="h-5 w-5 text-yellow-500" />;
      case 'ticket':
        return <TicketIcon className="h-5 w-5 text-purple-500" />;
      case 'wishlist':
        return <HeartIcon className="h-5 w-5 text-red-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-green-100 text-green-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={statusConfig[status as keyof typeof statusConfig] || statusConfig.pending}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <UserIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your account today.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.wishlistCount}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <HeartIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/wishlist">
                  <Button variant="outline" className="w-full text-sm">
                    View Wishlist
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inquiries</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.inquiriesCount}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/inquiries">
                  <Button variant="outline" className="w-full text-sm">
                    View Inquiries
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reviews</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.reviewsCount}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <StarIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/reviews">
                  <Button variant="outline" className="w-full text-sm">
                    View Reviews
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Support Tickets</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.ticketsCount}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TicketIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/support">
                  <Button variant="outline" className="w-full text-sm">
                    View Tickets
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.ordersCount}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <ShoppingCartIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/orders">
                  <Button variant="outline" className="w-full text-sm">
                    View Orders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUpIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No recent activities</p>
                    <p className="text-sm text-gray-500">
                      Start browsing products to see your activities here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 truncate">
                              {activity.title}
                            </p>
                            {activity.status && getStatusBadge(activity.status)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(activity.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/support">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    <TicketIcon className="h-4 w-4 mr-2" />
                    Create Support Ticket
                  </Button>
                </Link>
                
                <Link href="/wishlist">
                  <Button variant="outline" className="w-full">
                    <HeartIcon className="h-4 w-4 mr-2" />
                    View Wishlist
                  </Button>
                </Link>
                
                <Link href="/profile">
                  <Button variant="outline" className="w-full">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.email || 'Not provided'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Member since:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account status:</span>
                  <Badge className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
