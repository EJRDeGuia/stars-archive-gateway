import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ComprehensiveReportGenerator from '@/components/analytics/ComprehensiveReportGenerator';
import ViewsChart from '@/components/analytics/ViewsChart';
import { useSystemStats } from '@/hooks/useSystemStats';
import { useOptimizedAnalytics } from '@/hooks/useOptimizedAnalytics';
import { supabase } from '@/integrations/supabase/client';
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
  LineChart,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [topTheses, setTopTheses] = useState<any[]>([]);
  const [collegeStats, setCollegeStats] = useState<any[]>([]);
  const [userRoleStats, setUserRoleStats] = useState<any[]>([]);
  const [downloadStats, setDownloadStats] = useState({ total: 0, monthly: 0 });
  const [loading, setLoading] = useState(false);

  // Get real system statistics
  const { data: systemStats, isLoading: statsLoading } = useSystemStats();
  const { viewsSeries, uploadsSeries, loading: analyticsLoading } = useOptimizedAnalytics(30);

  const handleReportGenerated = (reportConfig: any) => {
    console.log('Report generated with config:', reportConfig);
    toast.success('Report generation initiated. You will receive it via email shortly.');
  };

  // Load detailed analytics data
  useEffect(() => {
    loadDetailedAnalytics();
  }, []);

  const loadDetailedAnalytics = async () => {
    setLoading(true);
    try {
      // Load top performing theses
      const { data: thesesData } = await supabase
        .from('theses')
        .select('id, title, view_count')
        .eq('status', 'approved')
        .order('view_count', { ascending: false })
        .limit(5);

      setTopTheses(thesesData || []);

      // Load college statistics
      const { data: collegesData } = await supabase
        .from('colleges')
        .select(`
          id, 
          name,
          theses(count)
        `);

      if (collegesData) {
        const collegeStatsData = await Promise.all(
          collegesData.map(async (college) => {
            const { count: thesesCount } = await supabase
              .from('theses')
              .select('*', { count: 'exact', head: true })
              .eq('college_id', college.id)
              .eq('status', 'approved');

            const { count: viewsCount } = await supabase
              .from('thesis_views')
              .select('*', { count: 'exact', head: true })
              .in('thesis_id', 
                await supabase
                  .from('theses')
                  .select('id')
                  .eq('college_id', college.id)
                  .eq('status', 'approved')
                  .then(({ data }) => data?.map(t => t.id) || [])
              );

            return {
              name: college.name,
              theses_count: thesesCount || 0,
              views_count: viewsCount || 0
            };
          })
        );

        setCollegeStats(collegeStatsData.sort((a, b) => b.theses_count - a.theses_count));
      }

      // Load user role distribution
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role');

      if (rolesData) {
        const roleStats = rolesData.reduce((acc: any, { role }) => {
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {});

        const total = rolesData.length;
        const roleStatsArray = Object.entries(roleStats).map(([role, count]: [string, any]) => ({
          role,
          count,
          percentage: Math.round((count / total) * 100)
        }));

        setUserRoleStats(roleStatsArray);
      }

      // Load download statistics
      const { count: totalDownloads } = await supabase
        .from('thesis_downloads')
        .select('*', { count: 'exact', head: true });

      const { count: monthlyDownloads } = await supabase
        .from('thesis_downloads')
        .select('*', { count: 'exact', head: true })
        .gte('downloaded_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      setDownloadStats({
        total: totalDownloads || 0,
        monthly: monthlyDownloads || 0
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
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
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {systemStats?.active_users?.value?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Theses</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {systemStats?.total_theses?.value?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <BookOpen className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Colleges</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {systemStats?.total_colleges?.value?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <Activity className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Weekly Views</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {systemStats?.weekly_views?.value?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analytics Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">User Analytics</TabsTrigger>
              <TabsTrigger value="content">Content Analytics</TabsTrigger>
              <TabsTrigger value="reports">Report Generator</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thesis Views (Last 30 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analyticsLoading ? (
                      <div className="h-64 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-dlsl-green" />
                      </div>
                    ) : (
                      <ViewsChart
                        title=""
                        data={viewsSeries}
                        legend="Views"
                        color="#06b6d4"
                      />
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>New Uploads (Last 30 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analyticsLoading ? (
                      <div className="h-64 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-dlsl-green" />
                      </div>
                    ) : (
                      <ViewsChart
                        title=""
                        data={uploadsSeries}
                        legend="Uploads"
                        color="#6366f1"
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="h-4 bg-gray-300 rounded w-48"></div>
                          <div className="h-4 bg-gray-300 rounded w-20"></div>
                        </div>
                      ))}
                    </div>
                  ) : topTheses.length > 0 ? (
                    <div className="space-y-4">
                      {topTheses.map((thesis, index) => (
                        <div key={thesis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{thesis.title}</span>
                          <span className="text-sm text-gray-600">{thesis.view_count || 0} views</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No thesis data available
                    </div>
                  )}
                </CardContent>
              </Card>
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
                      {loading ? (
                        <div className="space-y-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse flex justify-between items-center">
                              <div className="h-4 bg-gray-300 rounded w-20"></div>
                              <div className="h-4 bg-gray-300 rounded w-12"></div>
                            </div>
                          ))}
                        </div>
                      ) : userRoleStats.length > 0 ? (
                        <div className="space-y-2">
                          {userRoleStats.map((stat) => (
                            <div key={stat.role} className="flex justify-between items-center">
                              <span className="capitalize">{stat.role}s</span>
                              <span className="font-medium">{stat.percentage}% ({stat.count})</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500">No user role data available</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">Download Statistics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Total Downloads</span>
                          <span className="font-medium">{downloadStats.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Monthly Downloads</span>
                          <span className="font-medium">{downloadStats.monthly.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Active Users</span>
                          <span className="font-medium">{systemStats?.active_users?.value || 0}</span>
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
                      {loading ? (
                        <div className="space-y-3">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <div className="h-4 bg-gray-300 rounded w-32"></div>
                              <div className="text-right space-y-1">
                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                                <div className="h-3 bg-gray-300 rounded w-16"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : collegeStats.length > 0 ? (
                        <div className="space-y-3">
                          {collegeStats.slice(0, 5).map((college, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <span>{college.name}</span>
                              <div className="text-right">
                                <div className="font-medium">{college.theses_count.toLocaleString()} theses</div>
                                <div className="text-sm text-gray-600">{college.views_count.toLocaleString()} views</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500">No college data available</div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Download Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{downloadStats.total.toLocaleString()}</div>
                          <div className="text-sm text-blue-600">Total Downloads</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{downloadStats.monthly.toLocaleString()}</div>
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
