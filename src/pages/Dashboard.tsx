import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { colleges } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Upload, 
  Settings, 
  Users, 
  Database, 
  BarChart,
  Clock,
  Bookmark,
  ArrowRight,
  Code, 
  Calculator, 
  Microscope, 
  HeartPulse, 
  UtensilsCrossed,
  TrendingUp,
  Award,
  Sparkles,
  Send,
  Search,
  MessageCircle,
  Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const quickActions = [
    {
      title: 'Upload Thesis',
      description: 'Add new research to the repository',
      icon: Upload,
      action: () => navigate('/upload'),
      roles: ['archivist', 'admin'],
      color: 'from-emerald-600 to-emerald-700'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Settings,
      action: () => console.log('Navigate to settings'),
      roles: ['admin'],
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'User Management',
      description: 'Manage accounts and permissions',
      icon: Users,
      action: () => console.log('Navigate to user management'),
      roles: ['admin'],
      color: 'from-emerald-600 to-emerald-700'
    },
    {
      title: 'Database Tools',
      description: 'Backup and maintenance utilities',
      icon: Database,
      action: () => console.log('Navigate to backup'),
      roles: ['admin'],
      color: 'from-green-600 to-green-700'
    }
  ];

  const availableActions = quickActions.filter(action => 
    action.roles.includes(user?.role || 'researcher')
  );

  const totalTheses = colleges.reduce((sum, college) => sum + college.thesesCount, 0);

  const collegeData = [
    {
      id: '1',
      name: 'CITE',
      fullName: 'College of Information Technology and Engineering',
      color: 'red',
      thesesCount: 120,
      icon: Code,
      description: 'Advancing technology through innovative research',
      gradient: 'from-red-600 to-red-700'
    },
    {
      id: '2',
      name: 'CBEAM',
      fullName: 'College of Business, Economics, Accountancy, and Management',
      color: 'yellow',
      thesesCount: 145,
      icon: Calculator,
      description: 'Driving business excellence and economic growth',
      gradient: 'from-amber-600 to-amber-700'
    },
    {
      id: '3',
      name: 'CEAS',
      fullName: 'College of Education, Arts, and Sciences',
      color: 'blue',
      thesesCount: 98,
      icon: Microscope,
      description: 'Exploring knowledge across diverse disciplines',
      gradient: 'from-blue-600 to-blue-700'
    },
    {
      id: '4',
      name: 'CON',
      fullName: 'College of Nursing',
      color: 'gray',
      thesesCount: 76,
      icon: HeartPulse,
      description: 'Advancing healthcare through compassionate research',
      gradient: 'from-gray-600 to-gray-700'
    },
    {
      id: '5',
      name: 'CIHTM',
      fullName: 'College of International Hospitality and Tourism Management',
      color: 'green',
      thesesCount: 110,
      icon: UtensilsCrossed,
      description: 'Shaping the future of hospitality and tourism',
      gradient: 'from-emerald-600 to-emerald-700'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-900 to-emerald-800 rounded-2xl mb-8">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-green-900 mb-6 leading-tight tracking-tight">
              Welcome back, {user?.name}
            </h1>
            <p className="text-xl text-green-600 max-w-3xl mx-auto leading-relaxed">
              Discover and explore thesis repositories with our AI-powered research assistant
            </p>
          </div>

          {/* ChatGPT-style Search Interface */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-900">AI Research Assistant</h3>
                    <p className="text-green-600">Ask questions about theses, search by keywords, or explore topics</p>
                  </div>
                </div>
                
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex items-center bg-green-50 rounded-2xl border-2 border-green-100 focus-within:border-green-300 focus-within:bg-white transition-all duration-200">
                    <div className="pl-6">
                      <MessageCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ask anything about the research repository..."
                      className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg py-6 px-4 placeholder-green-500"
                    />
                    <div className="pr-4">
                      <Button 
                        type="submit"
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl px-6 py-3 transition-all duration-200"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </form>
                
                <div className="flex items-center gap-2 mt-4">
                  <Zap className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-500">Try: "Show me AI research from CITE" or "Find nursing theses from 2023"</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {availableActions.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-green-900 mb-8 text-center">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {availableActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.action}
                    className={`bg-gradient-to-br ${action.color} text-white h-auto p-8 flex flex-col items-start space-y-6 transition-all duration-300 border-0 rounded-2xl shadow-sm hover:shadow-md group`}
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <action.icon className="h-8 w-8" />
                    </div>
                    <div className="text-left space-y-3">
                      <div className="font-bold text-xl">{action.title}</div>
                      <div className="text-sm opacity-90 leading-relaxed">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white border border-green-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-green-900">Total Theses</h3>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-green-900 mb-4">{totalTheses.toLocaleString()}</div>
                <div className="flex items-center text-emerald-600 font-medium">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>Across all colleges</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-green-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-green-900">Active Colleges</h3>
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center">
                    <BarChart className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-green-900 mb-4">{collegeData.length}</div>
                <div className="flex items-center text-emerald-600 font-medium">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>Contributing to repository</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-green-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-green-900">Your Access</h3>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-green-900 mb-4 capitalize">{user?.role}</div>
                <div className="flex items-center text-emerald-600 font-medium">
                  <Award className="h-4 w-4 mr-2" />
                  <span>Current permissions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent & Bookmarked */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-white border border-green-100 rounded-2xl shadow-sm">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold flex items-center text-green-900">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    Recently Viewed
                  </h3>
                  <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50 rounded-xl">
                    View all
                  </Button>
                </div>
                <div className="space-y-6">
                  <div className="border-b border-green-100 pb-6">
                    <h4 className="font-bold text-green-900 mb-3 leading-relaxed">Artificial Intelligence Applications in Educational Technology</h4>
                    <p className="text-green-500">Viewed 2 hours ago • CITE</p>
                  </div>
                  <div className="border-b border-green-100 pb-6">
                    <h4 className="font-bold text-green-900 mb-3 leading-relaxed">Blockchain Technology for Secure Academic Credential Verification</h4>
                    <p className="text-green-500">Viewed 5 hours ago • CITE</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900 mb-3 leading-relaxed">Impact of Digital Marketing Strategies on SMEs in the Philippines</h4>
                    <p className="text-green-500">Viewed yesterday • CBEAM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-green-100 rounded-2xl shadow-sm">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold flex items-center text-green-900">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                      <Bookmark className="h-6 w-6 text-white" />
                    </div>
                    Bookmarked Theses
                  </h3>
                  <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50 rounded-xl">
                    View all
                  </Button>
                </div>
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="h-12 w-12 text-green-400" />
                  </div>
                  <h4 className="text-xl font-bold text-green-900 mb-4">No bookmarks yet</h4>
                  <p className="text-green-600 mb-8">You haven't saved any theses to your bookmarks</p>
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl transition-all duration-300">
                    Browse Theses
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Colleges Grid */}
          <div>
            <h2 className="text-3xl font-bold text-green-900 mb-8 text-center">Browse by College</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collegeData.map((college) => {
                const Icon = college.icon;

                return (
                  <div 
                    key={college.id} 
                    className="group cursor-pointer hover:shadow-md transition-all duration-300 border border-green-100 bg-white rounded-2xl transform hover:scale-105 shadow-sm overflow-hidden"
                    onClick={() => navigate(`/college/${college.id}`)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${college.gradient}`}></div>
                    <div className="p-8">
                      <div className="flex items-center mb-8">
                        <div className="bg-green-50 p-6 rounded-2xl group-hover:bg-green-100 transition-all">
                          <Icon className="h-8 w-8 text-green-700" />
                        </div>
                        <div className="ml-6 flex-1">
                          <h3 className="text-2xl font-bold text-green-900">{college.name}</h3>
                          <p className="text-green-600 leading-relaxed mt-2">{college.fullName}</p>
                        </div>
                      </div>
                      <p className="text-green-600 mb-8 leading-relaxed">{college.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-green-700" />
                          </div>
                          <span className="text-lg font-bold text-green-900">
                            {college.thesesCount}+ Theses
                          </span>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
                          <ArrowRight className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
