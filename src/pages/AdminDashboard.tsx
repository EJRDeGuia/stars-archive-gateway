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
import { theses } from '@/data/mockData';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // College data matching the landing page
  const collegeData = [
    {
      id: '1',
      name: 'CITE',
      fullName: 'College of Information Technology and Engineering',
      color: 'red',
      thesesCount: 120,
      icon: Code,
      bgColor: 'bg-red-500',
      bgColorLight: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      description: 'Advancing technology through innovative research'
    },
    {
      id: '2',
      name: 'CBEAM',
      fullName: 'College of Business, Economics, Accountancy, and Management',
      color: 'yellow',
      thesesCount: 145,
      icon: Calculator,
      bgColor: 'bg-yellow-500',
      bgColorLight: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      description: 'Driving business excellence and economic growth'
    },
    {
      id: '3',
      name: 'CEAS',
      fullName: 'College of Education, Arts, and Sciences',
      color: 'blue',
      thesesCount: 98,
      icon: Microscope,
      bgColor: 'bg-blue-500',
      bgColorLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      description: 'Exploring knowledge across diverse disciplines'
    },
    {
      id: '4',
      name: 'CON',
      fullName: 'College of Nursing',
      color: 'gray',
      thesesCount: 76,
      icon: HeartPulse,
      bgColor: 'bg-gray-500',
      bgColorLight: 'bg-gray-50',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      description: 'Advancing healthcare through compassionate research'
    },
    {
      id: '5',
      name: 'CIHTM',
      fullName: 'College of International Hospitality and Tourism Management',
      color: 'green',
      thesesCount: 110,
      icon: UtensilsCrossed,
      bgColor: 'bg-green-500',
      bgColorLight: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      description: 'Shaping the future of hospitality and tourism'
    }
  ];

  const stats = {
    totalUsers: 1247,
    totalTheses: theses.length,
    totalColleges: collegeData.length,
    monthlyUploads: 45,
    weeklyViews: 8324,
    securityAlerts: 3,
    networkSessions: 156
  };

  const recentActivity = [
    { action: 'New thesis uploaded', user: 'Dr. Maria Santos', time: '2 hours ago', type: 'upload' },
    { action: 'User registered', user: 'John Doe', time: '4 hours ago', type: 'registration' },
    { action: 'Security alert resolved', user: 'Admin', time: '1 day ago', type: 'security' },
    { action: 'College data updated', user: 'Admin', time: '1 day ago', type: 'update' }
  ];

  const handleCollegeClick = (collegeId: string) => {
    navigate(`/college/${collegeId}`);
  };

  const handleBackupDatabase = () => {
    toast.success('Database backup initiated successfully!');
    console.log('Database backup started');
    // TODO: Implement actual backup functionality with Supabase
  };

  const handleQuickAction = (action: string) => {
    console.log(`Admin action: ${action}`);
    switch (action) {
      case 'users':
        toast.info('User Management feature coming soon!');
        break;
      case 'colleges':
        toast.info('College Management feature coming soon!');
        break;
      case 'analytics':
        toast.info('Analytics Dashboard feature coming soon!');
        break;
      case 'settings':
        toast.info('System Settings feature coming soon!');
        break;
      case 'security':
        toast.info('Security Monitor feature coming soon!');
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
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        activity.type === 'upload' ? 'bg-dlsl-green' :
                        activity.type === 'registration' ? 'bg-blue-500' :
                        activity.type === 'security' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-gray-600 text-sm">{activity.user}</p>
                        <p className="text-gray-500 text-xs">{activity.time}</p>
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
                {collegeData.slice(0, 3).map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    onClick={() => handleCollegeClick(college.id)}
                    size="large"
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {collegeData.slice(3, 5).map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
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
              <div className="space-y-4">
                {theses.slice(0, 5).map((thesis) => (
                  <div key={thesis.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{thesis.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{thesis.author}</span>
                        <span>•</span>
                        <Badge variant="secondary" className="bg-dlsl-green/10 text-dlsl-green border-0">
                          {thesis.college}
                        </Badge>
                        <span>•</span>
                        <span>{thesis.year}</span>
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
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
