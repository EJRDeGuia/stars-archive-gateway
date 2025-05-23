
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { colleges } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Upload, 
  Settings, 
  Users, 
  Database, 
  Search,
  BarChart,
  Clock,
  Bookmark,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Upload Thesis',
      description: 'Add new thesis to the repository',
      icon: Upload,
      action: () => navigate('/upload'),
      roles: ['archivist', 'admin'],
      color: 'bg-dlsl-green'
    },
    {
      title: 'System Settings',
      description: 'Manage system configuration',
      icon: Settings,
      action: () => console.log('Navigate to settings'),
      roles: ['admin'],
      color: 'bg-dlsl-gold text-dlsl-green-dark'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Users,
      action: () => console.log('Navigate to user management'),
      roles: ['admin'],
      color: 'bg-blue-500'
    },
    {
      title: 'Database Backup',
      description: 'System backup and maintenance',
      icon: Database,
      action: () => console.log('Navigate to backup'),
      roles: ['admin'],
      color: 'bg-purple-500'
    }
  ];

  const availableActions = quickActions.filter(action => 
    action.roles.includes(user?.role || 'researcher')
  );

  const totalTheses = colleges.reduce((sum, college) => sum + college.thesesCount, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Access thesis repositories across all De La Salle Lipa colleges
            </p>
          </div>

          {/* Search */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Search Theses
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by title, author, keywords..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Quick Actions */}
          {availableActions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {availableActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} h-auto py-6 px-4 flex flex-col items-start space-y-2 hover:opacity-90 transition-opacity text-left`}
                  >
                    <action.icon className="h-8 w-8" />
                    <div>
                      <div className="font-semibold text-lg">{action.title}</div>
                      <div className="text-sm opacity-90">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Theses</h3>
                  <div className="bg-green-100 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-dlsl-green" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{totalTheses}</div>
                <p className="text-sm text-gray-600 mt-1">Across all colleges</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Active Colleges</h3>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <BarChart className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{colleges.length}</div>
                <p className="text-sm text-gray-600 mt-1">Contributing to repository</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Your Access Level</h3>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 capitalize">{user?.role}</div>
                <p className="text-sm text-gray-600 mt-1">Your current permissions</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent & Bookmarked */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-dlsl-green" />
                    Recently Viewed
                  </h3>
                  <Button variant="ghost" size="sm" className="text-dlsl-green">
                    View all
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <h4 className="font-medium text-gray-900 mb-1">Artificial Intelligence Applications in Educational Technology</h4>
                    <p className="text-sm text-gray-600">Viewed 2 hours ago</p>
                  </div>
                  <div className="border-b pb-3">
                    <h4 className="font-medium text-gray-900 mb-1">Blockchain Technology for Secure Academic Credential Verification</h4>
                    <p className="text-sm text-gray-600">Viewed 5 hours ago</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Impact of Digital Marketing Strategies on SMEs in the Philippines</h4>
                    <p className="text-sm text-gray-600">Viewed yesterday</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Bookmark className="mr-2 h-5 w-5 text-dlsl-green" />
                    Bookmarked Theses
                  </h3>
                  <Button variant="ghost" size="sm" className="text-dlsl-green">
                    View all
                  </Button>
                </div>
                <div className="text-center py-8">
                  <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">No bookmarks yet</h4>
                  <p className="text-gray-500 mb-4">You haven't saved any theses to your bookmarks</p>
                  <Button variant="outline" className="text-dlsl-green border-dlsl-green">
                    Browse Theses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colleges Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Browse by College</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colleges.map((college) => {
                const colorMappings: Record<string, { bg: string, icon: string, text: string, border: string }> = {
                  'red': { 
                    bg: 'bg-red-50', 
                    icon: 'bg-red-500 text-white', 
                    text: 'text-red-500',
                    border: 'border-red-200'
                  },
                  'blue': { 
                    bg: 'bg-blue-50', 
                    icon: 'bg-blue-500 text-white',
                    text: 'text-blue-500',
                    border: 'border-blue-200'
                  },
                  'yellow': { 
                    bg: 'bg-yellow-50', 
                    icon: 'bg-yellow-500 text-white',
                    text: 'text-yellow-500',
                    border: 'border-yellow-200'
                  },
                  'green': { 
                    bg: 'bg-green-50', 
                    icon: 'bg-green-500 text-white',
                    text: 'text-green-500',
                    border: 'border-green-200'
                  },
                  'gray': { 
                    bg: 'bg-gray-50', 
                    icon: 'bg-gray-500 text-white',
                    text: 'text-gray-500',
                    border: 'border-gray-200'
                  }
                };
                
                const colorSet = colorMappings[college.color] || colorMappings.gray;
                const Icon = college.icon;

                return (
                  <Card 
                    key={college.id} 
                    className={`hover:shadow-md transition-shadow cursor-pointer bg-white border ${colorSet.border}`}
                    onClick={() => navigate(`/college/${college.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`${colorSet.bg} p-3 rounded-full`}>
                          <div className={`${colorSet.icon} p-2 rounded-full`}>
                            <Icon className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">{college.name}</h3>
                          <p className="text-sm text-gray-600">{college.fullName}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{college.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{college.thesesCount} theses</span>
                          <span className="mx-2">•</span>
                          <span>Since {college.since}</span>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`${colorSet.text}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/college/${college.id}`);
                          }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
