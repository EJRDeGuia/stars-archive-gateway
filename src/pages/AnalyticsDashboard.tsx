
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  TrendingUp,
  Eye,
  Download,
  Users,
  BookOpen,
  ArrowLeft,
  Calendar
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();

  // Mock analytics data
  const stats = {
    totalViews: 15420,
    totalDownloads: 3250,
    activeUsers: 892,
    newTheses: 45
  };

  const monthlyData = [
    { month: 'Jan', views: 1200, downloads: 280, uploads: 12 },
    { month: 'Feb', views: 1450, downloads: 320, uploads: 18 },
    { month: 'Mar', views: 1680, downloads: 390, uploads: 22 },
    { month: 'Apr', views: 1920, downloads: 450, uploads: 28 },
    { month: 'May', views: 2100, downloads: 510, uploads: 35 },
    { month: 'Jun', views: 2350, downloads: 580, uploads: 41 }
  ];

  const collegeStats = [
    { name: 'CITE', theses: 120, views: 4250, downloads: 890 },
    { name: 'CBEAM', theses: 145, views: 5120, downloads: 1020 },
    { name: 'CEAS', theses: 98, views: 3680, downloads: 720 },
    { name: 'CON', theses: 76, views: 2890, downloads: 580 },
    { name: 'CIHTM', theses: 110, views: 3940, downloads: 810 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Dashboard
              </Button>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-dlsl-green rounded-xl flex items-center justify-center">
                <BarChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-xl text-gray-600">System usage reports and statistics</p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Views</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                    <p className="text-dlsl-green text-sm font-medium">+12% this month</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Downloads</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalDownloads.toLocaleString()}</p>
                    <p className="text-dlsl-green text-sm font-medium">+8% this month</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                    <p className="text-dlsl-green text-sm font-medium">+15% this month</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">New Theses</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.newTheses}</p>
                    <p className="text-dlsl-green text-sm font-medium">This month</p>
                  </div>
                  <div className="w-12 h-12 bg-dlsl-green/10 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-dlsl-green" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Monthly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data) => (
                    <div key={data.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{data.month}</span>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-blue-600">{data.views} views</span>
                        <span className="text-green-600">{data.downloads} downloads</span>
                        <span className="text-dlsl-green">{data.uploads} uploads</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  College Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collegeStats.map((college) => (
                    <div key={college.name} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{college.name}</span>
                        <span className="text-sm text-gray-600">{college.theses} theses</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{college.views.toLocaleString()} views</span>
                        <span>•</span>
                        <span>{college.downloads} downloads</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnalyticsDashboard;
