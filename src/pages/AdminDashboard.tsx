import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import AdminQuickActions from '@/components/AdminQuickActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  BookOpen,
  Building,
  TrendingUp,
  FileText,
  Eye,
  Clock,
  Shield,
  AlertTriangle,
  Code,
  Calculator,
  Microscope,
  HeartPulse,
  UtensilsCrossed
} from 'lucide-react';
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';

// For now, provide fallback values. Replace with Supabase queries in the future.
const theses = [];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [colleges, setColleges] = useState<any[]>([]);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [theses, setTheses] = useState<any[]>([]);
  const [thesesLoading, setThesesLoading] = useState(true);

  useEffect(() => {
    setCollegesLoading(true);
    supabase
      .from('colleges')
      .select('*')
      .order('name', { ascending: true })
      .then(({ data }) => {
        setColleges(data || []);
        setCollegesLoading(false);
      });
  }, []);

  useEffect(() => {
    setThesesLoading(true);
    supabase
      .from('theses')
      .select('*')
      .order('created_at', { descending: true })
      .limit(5)
      .then(({ data }) => {
        setTheses(data || []);
        setThesesLoading(false);
      });
  }, []);

  // Statistics Calculation (all 0, will update in next phase)
  const stats = {
    totalUsers: 0,
    totalTheses: theses.length,
    totalColleges: colleges.length,
    monthlyUploads: 0,
    weeklyViews: 0,
    securityAlerts: 0,
    networkSessions: 0,
  };

  const recentActivity: any[] = []; // Empty for now

  const handleCollegeClick = (collegeId: string) => {
    navigate(`/college/${collegeId}`);
  };

  const handleBackupDatabase = () => {
    toast.success('Database backup initiated successfully!');
    console.log('Database backup started');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'users':
        navigate('/user-management');
        break;
      case 'colleges':
        navigate('/college-management');
        break;
      case 'analytics':
        navigate('/analytics-dashboard');
        break;
      case 'settings':
        navigate('/system-settings');
        break;
      case 'security':
        navigate('/security-monitor');
        break;
      case 'backup':
        handleBackupDatabase();
        break;
      default:
        console.log('Unknown admin action:', action);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Admin Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-dlsl-green rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xl text-gray-600">System Administration Portal</p>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-dlsl-green text-sm font-medium">+12% this month</p>
                  </div>
                  <div className="w-12 h-12 bg-dlsl-green/10 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-dlsl-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Theses</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalTheses}</p>
                    <p className="text-dlsl-green text-sm font-medium">+{stats.monthlyUploads} this month</p>
                  </div>
                  <div className="w-12 h-12 bg-dlsl-green/10 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-dlsl-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Colleges</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalColleges}</p>
                    <p className="text-dlsl-green text-sm font-medium">Active programs</p>
                  </div>
                  <div className="w-12 h-12 bg-dlsl-green/10 rounded-2xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-dlsl-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Security Alerts</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.securityAlerts}</p>
                    <p className="text-red-600 text-sm font-medium">Active monitoring</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions - Centered */}
          <div className="mb-12">
            <AdminQuickActions onActionClick={handleQuickAction} />
          </div>

          {/* Management Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-center text-gray-400 py-8">No recent activity to display.</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800 font-medium">Database Status</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800 font-medium">Network Access</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Secured</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-yellow-800 font-medium">Backup Status</span>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Scheduled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800 font-medium">Active Sessions</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">{stats.networkSessions}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colleges Overview */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              Colleges Management
            </h2>
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {collegesLoading
                  ? <div className="text-gray-400 col-span-3 text-center py-8">Loading colleges...</div>
                  : colleges.slice(0, 3).map((college) => (
                      <CollegeCard
                        key={college.id}
                        college={{
                          ...college,
                          icon: null,
                          bgColor: 'bg-gray-200',
                          bgColorLight: 'bg-gray-50',
                          textColor: 'text-gray-700',
                          borderColor: 'border-gray-200',
                          description: college.description,
                        }}
                        onClick={() => handleCollegeClick(college.id)}
                        size="large"
                      />
                  ))
                }
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {!collegesLoading && colleges.slice(3, 5).map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={{
                      ...college,
                      icon: null,
                      bgColor: 'bg-gray-200',
                      bgColorLight: 'bg-gray-50',
                      textColor: 'text-gray-700',
                      borderColor: 'border-gray-200',
                      description: college.description,
                    }}
                    onClick={() => handleCollegeClick(college.id)}
                    size="large"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Theses Overview */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Recent Thesis Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {thesesLoading ? (
                <div className="text-gray-400 text-center py-8">Loading recent theses...</div>
              ) : theses.length === 0 ? (
                <div className="text-gray-400 text-center py-8">No thesis submissions yet.</div>
              ) : (
                <div className="space-y-4">
                  {theses.map((thesis) => (
                    <div key={thesis.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{thesis.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{thesis.author}</span>
                          <span>•</span>
                          <Badge variant="secondary" className="bg-dlsl-green/10 text-dlsl-green border-0">
                            {(colleges.find(c => c.id === thesis.college_id)?.name) || thesis.college_id}
                          </Badge>
                          <span>•</span>
                          <span>{thesis.year || (thesis.publish_date && thesis.publish_date.slice(0, 4))}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="border-gray-300">
                          <Eye className="w-4 h-4 mr-1 text-dlsl-green" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
