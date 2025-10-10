import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  TrendingUp,
  Users,
  FileText,
  Eye,
  Download,
  Clock,
  Activity,
  BarChart3
} from 'lucide-react';

interface AnalyticsStat {
  label: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
}

export function EnhancedAnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');

  // Real-time thesis statistics
  const { data: thesisStats } = useQuery({
    queryKey: ['thesis-stats', selectedPeriod],
    queryFn: async () => {
      const periods = {
        day: 1,
        week: 7,
        month: 30
      };

      const daysBack = periods[selectedPeriod];
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

      const [totalTheses, approvedTheses, pendingTheses, recentViews, recentDownloads] = await Promise.all([
        supabase.from('theses').select('id', { count: 'exact', head: true }),
        supabase.from('theses').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('theses').select('id', { count: 'exact', head: true }).eq('status', 'pending_review'),
        supabase.from('thesis_views').select('id', { count: 'exact', head: true }).gte('viewed_at', startDate),
        supabase.from('thesis_downloads').select('id', { count: 'exact', head: true }).gte('downloaded_at', startDate)
      ]);

      return {
        total: totalTheses.count || 0,
        approved: approvedTheses.count || 0,
        pending: pendingTheses.count || 0,
        views: recentViews.count || 0,
        downloads: recentDownloads.count || 0
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Active users statistics
  const { data: userStats } = useQuery({
    queryKey: ['user-stats', selectedPeriod],
    queryFn: async () => {
      const periods = {
        day: 1,
        week: 7,
        month: 30
      };

      const daysBack = periods[selectedPeriod];
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

      const [totalUsers, activeUsers, activeSessions] = await Promise.all([
        supabase.from('user_roles').select('user_id', { count: 'exact', head: true }),
        supabase.from('session_tracking').select('user_id', { count: 'exact', head: true }).gte('last_activity', startDate),
        supabase.from('session_tracking').select('id', { count: 'exact', head: true }).eq('is_active', true)
      ]);

      return {
        total: totalUsers.count || 0,
        active: activeUsers.count || 0,
        sessions: activeSessions.count || 0
      };
    },
    refetchInterval: 30000
  });

  // Most viewed theses
  const { data: topTheses } = useQuery({
    queryKey: ['top-theses', selectedPeriod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('theses')
        .select('id, title, view_count, download_count')
        .eq('status', 'approved')
        .order('view_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60000 // Refresh every minute
  });

  // College activity breakdown
  const { data: collegeActivity } = useQuery({
    queryKey: ['college-activity'],
    queryFn: async () => {
      const { data: colleges, error: collegesError } = await supabase
        .from('colleges')
        .select('id, name');

      if (collegesError) throw collegesError;

      const activities = await Promise.all(
        (colleges || []).map(async (college) => {
          const { count } = await supabase
            .from('theses')
            .select('id', { count: 'exact', head: true })
            .eq('college_id', college.id)
            .eq('status', 'approved');

          return {
            college: college.name,
            count: count || 0
          };
        })
      );

      return activities.sort((a, b) => b.count - a.count).slice(0, 5);
    },
    refetchInterval: 60000
  });

  const stats: AnalyticsStat[] = [
    {
      label: 'Total Theses',
      value: thesisStats?.total || 0,
      icon: <FileText className="w-5 h-5" />
    },
    {
      label: 'Approved',
      value: thesisStats?.approved || 0,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      label: 'Active Users',
      value: userStats?.active || 0,
      icon: <Users className="w-5 h-5" />
    },
    {
      label: 'Active Sessions',
      value: userStats?.sessions || 0,
      icon: <Activity className="w-5 h-5" />
    },
    {
      label: 'Recent Views',
      value: thesisStats?.views || 0,
      icon: <Eye className="w-5 h-5" />
    },
    {
      label: 'Recent Downloads',
      value: thesisStats?.downloads || 0,
      icon: <Download className="w-5 h-5" />
    },
    {
      label: 'Pending Review',
      value: thesisStats?.pending || 0,
      icon: <Clock className="w-5 h-5" />
    },
    {
      label: 'Total Users',
      value: userStats?.total || 0,
      icon: <Users className="w-5 h-5" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Enhanced Analytics Dashboard</h2>
        <div className="flex gap-2">
          <Badge 
            variant={selectedPeriod === 'day' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedPeriod('day')}
          >
            Last 24h
          </Badge>
          <Badge 
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedPeriod('week')}
          >
            Last 7 days
          </Badge>
          <Badge 
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedPeriod('month')}
          >
            Last 30 days
          </Badge>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                  {stat.change && (
                    <p className={`text-sm ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-dlsl-green/10 rounded-lg flex items-center justify-center text-dlsl-green">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="theses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="theses">Top Theses</TabsTrigger>
          <TabsTrigger value="colleges">College Activity</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="theses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Viewed Theses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTheses?.map((thesis, index) => (
                  <div key={thesis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-dlsl-green text-white">{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{thesis.title}</p>
                        <div className="flex gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {thesis.view_count} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {thesis.download_count} downloads
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colleges" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>College Activity (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collegeActivity?.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-dlsl-green" />
                      <span className="font-medium">{activity.college}</span>
                    </div>
                    <Badge className="bg-dlsl-green text-white">
                      {activity.count} theses
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">Upload Activity</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Average of {Math.round((thesisStats?.total || 0) / 30)} theses uploaded per day
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-900">User Engagement</p>
                  <p className="text-sm text-green-700 mt-1">
                    {Math.round(((userStats?.active || 0) / (userStats?.total || 1)) * 100)}% of users active in selected period
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-900">Content Access</p>
                  <p className="text-sm text-purple-700 mt-1">
                    Average of {Math.round((thesisStats?.views || 0) / (thesisStats?.approved || 1))} views per thesis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
