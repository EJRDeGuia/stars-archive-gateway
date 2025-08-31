import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOptimizedAnalytics } from '@/hooks/useOptimizedAnalytics';
import { useSystemStats } from '@/hooks/useSystemStats';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Eye, Upload, Download, Calendar, BarChart3 } from 'lucide-react';

interface AnalyticsMetric {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

const EnhancedAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7');
  const { data: systemStats } = useSystemStats();
  const { viewsSeries, uploadsSeries, loading } = useOptimizedAnalytics(parseInt(timeRange));

  // Sample data for additional metrics
  const metrics: AnalyticsMetric[] = [
    {
      title: 'Total Views',
      value: systemStats?.weekly_views?.value || 0,
      change: '+12.5%',
      trend: 'up',
      icon: <Eye className="w-4 h-4" />
    },
    {
      title: 'New Uploads',
      value: systemStats?.monthly_uploads?.value || 0,
      change: '+8.2%',
      trend: 'up',
      icon: <Upload className="w-4 h-4" />
    },
    {
      title: 'Active Users',
      value: systemStats?.active_users?.value || 0,
      change: '+5.7%',
      trend: 'up',
      icon: <Users className="w-4 h-4" />
    },
    {
      title: 'Total Collections',
      value: systemStats?.total_collections?.value || 0,
      change: '+3.1%',
      trend: 'up',
      icon: <BarChart3 className="w-4 h-4" />
    }
  ];

  // Sample college usage data
  const collegeData = [
    { name: 'Engineering', value: 35, color: '#059669' },
    { name: 'Business', value: 25, color: '#3B82F6' },
    { name: 'Education', value: 20, color: '#8B5CF6' },
    { name: 'Arts & Sciences', value: 15, color: '#F59E0B' },
    { name: 'Others', value: 5, color: '#EF4444' }
  ];

  // Sample trending content
  const trendingContent = [
    { title: 'Machine Learning Applications', views: 342, type: 'Thesis' },
    { title: 'Sustainable Energy Solutions', views: 298, type: 'Thesis' },
    { title: 'Educational Technology Research', views: 267, type: 'Thesis' },
    { title: 'Business Innovation Strategies', views: 234, type: 'Thesis' },
    { title: 'Environmental Impact Studies', views: 198, type: 'Thesis' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 Days</SelectItem>
            <SelectItem value="14">14 Days</SelectItem>
            <SelectItem value="30">30 Days</SelectItem>
            <SelectItem value="90">90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(Number(metric.value))}
                  </p>
                  <div className="flex items-center mt-2 space-x-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-sm ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-dlsl-green to-dlsl-green-light rounded-full flex items-center justify-center">
                  <div className="text-white">{metric.icon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Views Trend</CardTitle>
            <CardDescription>Daily thesis views over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewsSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="label" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#059669" 
                    fill="#059669" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Uploads Chart */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Upload Activity</CardTitle>
            <CardDescription>Daily thesis uploads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={uploadsSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="label" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* College Distribution */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Usage by College</CardTitle>
            <CardDescription>Distribution of thesis submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={collegeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {collegeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {collegeData.map((college, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: college.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {college.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trending Content */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Trending Content</CardTitle>
            <CardDescription>Most viewed theses this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {content.title}
                      </span>
                      <Badge variant="secondary" className="text-xs">{content.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Eye className="w-3 h-3" />
                      <span>{content.views} views</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-dlsl-green">#{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Export Analytics</CardTitle>
          <CardDescription>Download analytics reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF Report
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAnalytics;