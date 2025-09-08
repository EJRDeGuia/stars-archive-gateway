import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ComprehensiveReportGenerator from '@/components/analytics/ComprehensiveReportGenerator';
import {
  BarChart,
  TrendingUp,
  Eye,
  Download,
  Users,
  BookOpen,
  ArrowLeft,
  Calendar,
  Activity,
  LineChart
} from 'lucide-react';
import { toast } from 'sonner';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleReportGenerated = (reportConfig: any) => {
    console.log('Report generated with config:', reportConfig);
    toast.success('Report generation initiated. You will receive it via email shortly.');
  };

  const mockMetrics = {
    totalUsers: 1247,
    activeUsers: 342,
    totalTheses: 5689,
    monthlyViews: 28456,
    avgSessionDuration: '12:34',
    topCollege: 'College of Engineering'
  };

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
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-xl text-gray-600">Comprehensive data analysis and reporting</p>
              </div>
            </div>
          </div>

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{mockMetrics.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{mockMetrics.activeUsers}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Theses</p>
                    <p className="text-2xl font-bold text-gray-900">{mockMetrics.totalTheses.toLocaleString()}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Views</p>
                    <p className="text-2xl font-bold text-gray-900">{mockMetrics.monthlyViews.toLocaleString()}</p>
                  </div>
                  <Eye className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">User Analytics</TabsTrigger>
              <TabsTrigger value="content">Content Analytics</TabsTrigger>
              <TabsTrigger value="reports">Report Generator</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Usage trend chart placeholder</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Advanced Machine Learning', 'Sustainable Architecture', 'Quantum Computing Basics'].map((title, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{title}</span>
                          <span className="text-sm text-gray-600">{(1250 - index * 200).toLocaleString()} views</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Demographics & Behavior</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">User Distribution by Role</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Researchers</span>
                          <span className="font-medium">78%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Archivists</span>
                          <span className="font-medium">15%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Administrators</span>
                          <span className="font-medium">7%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">Average Session Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Session Duration</span>
                          <span className="font-medium">{mockMetrics.avgSessionDuration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Pages per Session</span>
                          <span className="font-medium">4.2</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Bounce Rate</span>
                          <span className="font-medium">23%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Performance & Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Most Popular Colleges</h4>
                      <div className="space-y-3">
                        {['College of Engineering', 'College of Science', 'College of Business'].map((college, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <span>{college}</span>
                            <div className="text-right">
                              <div className="font-medium">{(2300 - index * 400).toLocaleString()} theses</div>
                              <div className="text-sm text-gray-600">{(15000 - index * 3000).toLocaleString()} views</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Download Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">12,450</div>
                          <div className="text-sm text-blue-600">Total Downloads</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">847</div>
                          <div className="text-sm text-green-600">This Month</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <ComprehensiveReportGenerator onGenerateReport={handleReportGenerated} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnalyticsDashboard;
