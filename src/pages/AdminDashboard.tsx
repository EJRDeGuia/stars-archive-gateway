import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  BookOpen,
  Building,
  TrendingUp,
  FileText,
  Download,
  Eye,
  Clock,
  Settings,
  Shield,
  BarChart
} from 'lucide-react';
import { colleges, theses } from '@/data/mockData';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = {
    totalUsers: 1247,
    totalTheses: theses.length,
    totalColleges: colleges.length,
    monthlyUploads: 45,
    weeklyViews: 8324,
    pendingApprovals: 12
  };

  const recentActivity = [
    { action: 'New thesis uploaded', user: 'Dr. Maria Santos', time: '2 hours ago', type: 'upload' },
    { action: 'User registered', user: 'John Doe', time: '4 hours ago', type: 'registration' },
    { action: 'Thesis approved', user: 'Prof. Garcia', time: '6 hours ago', type: 'approval' },
    { action: 'College data updated', user: 'Admin', time: '1 day ago', type: 'update' }
  ];

  const handleCollegeClick = (collegeId: string) => {
    navigate(`/college/${collegeId}`);
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
                <p className="text-xl text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-green-600 text-sm font-medium">+12% this month</p>
                  </div>
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Theses</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalTheses}</p>
                    <p className="text-green-600 text-sm font-medium">+{stats.monthlyUploads} this month</p>
                  </div>
                  <div className="w-16 h-16 bg-dlsl-green/10 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-dlsl-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Colleges</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalColleges}</p>
                    <p className="text-gray-500 text-sm font-medium">All departments</p>
                  </div>
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Building className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Weekly Views</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.weeklyViews.toLocaleString()}</p>
                    <p className="text-green-600 text-sm font-medium">+8% from last week</p>
                  </div>
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Eye className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pending Approvals</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                    <p className="text-orange-600 text-sm font-medium">Requires attention</p>
                  </div>
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <Clock className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Monthly Uploads</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.monthlyUploads}</p>
                    <p className="text-green-600 text-sm font-medium">Above average</p>
                  </div>
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-dlsl-green hover:bg-dlsl-green/90 text-white justify-start py-6 text-lg">
                  <Users className="mr-3 h-5 w-5" />
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start py-6 text-lg">
                  <BookOpen className="mr-3 h-5 w-5" />
                  Review Pending Theses
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start py-6 text-lg">
                  <Building className="mr-3 h-5 w-5" />
                  Manage Colleges
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start py-6 text-lg">
                  <BarChart className="mr-3 h-5 w-5" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start py-6 text-lg">
                  <Settings className="mr-3 h-5 w-5" />
                  System Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        activity.type === 'upload' ? 'bg-dlsl-green' :
                        activity.type === 'registration' ? 'bg-blue-500' :
                        activity.type === 'approval' ? 'bg-green-500' :
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
          </div>

          {/* Colleges Overview */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Colleges Overview</h2>
            <div className="max-w-6xl mx-auto">
              {/* Top row: CITE, CBEAM, CEAS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <CollegeCard
                  key={colleges[0].id}
                  college={colleges[0]}
                  onClick={() => handleCollegeClick(colleges[0].id)}
                  size="large"
                />
                <CollegeCard
                  key={colleges[1].id}
                  college={colleges[1]}
                  onClick={() => handleCollegeClick(colleges[1].id)}
                  size="large"
                />
                <CollegeCard
                  key={colleges[2].id}
                  college={colleges[2]}
                  onClick={() => handleCollegeClick(colleges[2].id)}
                  size="large"
                />
              </div>
              
              {/* Bottom row: CON and CIHTM positioned in middle */}
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                <div className="lg:col-start-2 lg:col-span-2">
                  <CollegeCard
                    key={colleges[3].id}
                    college={colleges[3]}
                    onClick={() => handleCollegeClick(colleges[3].id)}
                    size="large"
                  />
                </div>
                <div className="lg:col-start-4 lg:col-span-2">
                  <CollegeCard
                    key={colleges[4].id}
                    college={colleges[4]}
                    onClick={() => handleCollegeClick(colleges[4].id)}
                    size="large"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Theses Overview */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Recent Thesis Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {theses.slice(0, 5).map((thesis) => (
                  <div key={thesis.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
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
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="bg-dlsl-green hover:bg-dlsl-green/90 text-white">
                        Approve
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
