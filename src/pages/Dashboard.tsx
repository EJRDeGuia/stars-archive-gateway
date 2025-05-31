import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchInterface from '@/components/SearchInterface';
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
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Upload Thesis',
      description: 'Add new research to the repository',
      icon: Upload,
      action: () => navigate('/upload'),
      roles: ['archivist', 'admin'],
      color: 'from-dlsl-green via-dlsl-green-light to-emerald-400'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Settings,
      action: () => console.log('Navigate to settings'),
      roles: ['admin'],
      color: 'from-dlsl-gold via-yellow-400 to-amber-400'
    },
    {
      title: 'User Management',
      description: 'Manage accounts and permissions',
      icon: Users,
      action: () => console.log('Navigate to user management'),
      roles: ['admin'],
      color: 'from-blue-500 via-blue-600 to-indigo-500'
    },
    {
      title: 'Database Tools',
      description: 'Backup and maintenance utilities',
      icon: Database,
      action: () => console.log('Navigate to backup'),
      roles: ['admin'],
      color: 'from-purple-500 via-purple-600 to-violet-500'
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
      gradient: 'from-red-500 to-red-600'
    },
    {
      id: '2',
      name: 'CBEAM',
      fullName: 'College of Business, Economics, Accountancy, and Management',
      color: 'yellow',
      thesesCount: 145,
      icon: Calculator,
      description: 'Driving business excellence and economic growth',
      gradient: 'from-yellow-500 to-amber-500'
    },
    {
      id: '3',
      name: 'CEAS',
      fullName: 'College of Education, Arts, and Sciences',
      color: 'blue',
      thesesCount: 98,
      icon: Microscope,
      description: 'Exploring knowledge across diverse disciplines',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: '4',
      name: 'CON',
      fullName: 'College of Nursing',
      color: 'gray',
      thesesCount: 76,
      icon: HeartPulse,
      description: 'Advancing healthcare through compassionate research',
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      id: '5',
      name: 'CIHTM',
      fullName: 'College of International Hospitality and Tourism Management',
      color: 'green',
      thesesCount: 110,
      icon: UtensilsCrossed,
      description: 'Shaping the future of hospitality and tourism',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  const getCollegeColors = (color: string) => {
    const colorMap = {
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
      gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' }
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      
      <main className="flex-1 animate-fade-in">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-dlsl-green via-dlsl-green-light to-emerald-400 rounded-3xl sleek-shadow-xl mb-8 transform hover:scale-105 transition-all duration-300">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-dlsl-green via-dlsl-green-light to-emerald-500 bg-clip-text text-transparent mb-8 leading-tight tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Discover and explore thesis repositories across all De La Salle Lipa colleges with our AI-powered research assistant
            </p>
          </div>

          {/* Enhanced Search Section */}
          <div className="mb-20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <SearchInterface 
              onSearch={(query) => console.log('Search:', query)}
              className="max-w-5xl mx-auto"
            />
          </div>

          {/* Quick Actions */}
          {availableActions.length > 0 && (
            <div className="mb-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-4xl font-bold text-slate-800 mb-12 text-center tracking-tight">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {availableActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.action}
                    className={`bg-gradient-to-br ${action.color} text-white h-auto p-8 flex flex-col items-start space-y-6 transition-all duration-300 transform hover:scale-105 border-0 rounded-2xl sleek-shadow-xl hover:sleek-shadow-2xl group`}
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <action.icon className="h-8 w-8" />
                    </div>
                    <div className="text-left space-y-3">
                      <div className="font-bold text-xl tracking-tight">{action.title}</div>
                      <div className="text-sm opacity-90 leading-relaxed font-medium">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Card className="bg-white sleek-shadow-xl border-0 rounded-2xl overflow-hidden hover:sleek-shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-700 tracking-tight">Total Theses</h3>
                  <div className="w-16 h-16 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-2xl flex items-center justify-center sleek-shadow-lg group-hover:sleek-shadow-xl transition-all">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">{totalTheses.toLocaleString()}</div>
                <div className="flex items-center text-sm text-slate-600 font-medium">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                  <span>Across all colleges</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white sleek-shadow-xl border-0 rounded-2xl overflow-hidden hover:sleek-shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-700 tracking-tight">Active Colleges</h3>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center sleek-shadow-lg group-hover:sleek-shadow-xl transition-all">
                    <BarChart className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">{collegeData.length}</div>
                <div className="flex items-center text-sm text-slate-600 font-medium">
                  <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Contributing to repository</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white sleek-shadow-xl border-0 rounded-2xl overflow-hidden hover:sleek-shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-700 tracking-tight">Your Access</h3>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center sleek-shadow-lg group-hover:sleek-shadow-xl transition-all">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-5xl font-bold text-slate-900 mb-4 capitalize tracking-tight">{user?.role}</div>
                <div className="flex items-center text-sm text-slate-600 font-medium">
                  <Award className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Current permissions</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent & Bookmarked */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Card className="bg-white shadow-2xl border-0 rounded-2xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold flex items-center text-slate-800">
                    <div className="w-12 h-12 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    Recently Viewed
                  </h3>
                  <Button variant="ghost" size="sm" className="text-dlsl-green hover:bg-dlsl-green/10 rounded-xl">
                    View all
                  </Button>
                </div>
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-6">
                    <h4 className="font-bold text-slate-900 mb-3 text-lg leading-relaxed">Artificial Intelligence Applications in Educational Technology</h4>
                    <p className="text-sm text-slate-500">Viewed 2 hours ago • CITE</p>
                  </div>
                  <div className="border-b border-slate-100 pb-6">
                    <h4 className="font-bold text-slate-900 mb-3 text-lg leading-relaxed">Blockchain Technology for Secure Academic Credential Verification</h4>
                    <p className="text-sm text-slate-500">Viewed 5 hours ago • CITE</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3 text-lg leading-relaxed">Impact of Digital Marketing Strategies on SMEs in the Philippines</h4>
                    <p className="text-sm text-slate-500">Viewed yesterday • CBEAM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-2xl border-0 rounded-2xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold flex items-center text-slate-800">
                    <div className="w-12 h-12 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <Bookmark className="h-6 w-6 text-white" />
                    </div>
                    Bookmarked Theses
                  </h3>
                  <Button variant="ghost" size="sm" className="text-dlsl-green hover:bg-dlsl-green/10 rounded-xl">
                    View all
                  </Button>
                </div>
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="h-12 w-12 text-slate-300" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-700 mb-4">No bookmarks yet</h4>
                  <p className="text-slate-500 mb-8 leading-relaxed text-lg">You haven't saved any theses to your bookmarks</p>
                  <Button className="bg-dlsl-green hover:bg-dlsl-green-dark text-white px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    Browse Theses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colleges Grid */}
          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-4xl font-bold text-slate-800 mb-12 text-center tracking-tight">Browse by College</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collegeData.map((college) => {
                const colors = getCollegeColors(college.color);
                const Icon = college.icon;

                return (
                  <Card 
                    key={college.id} 
                    className="group cursor-pointer hover:sleek-shadow-2xl transition-all duration-300 border-0 bg-white rounded-2xl transform hover:scale-105 sleek-shadow-xl overflow-hidden"
                    onClick={() => navigate(`/college/${college.id}`)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${college.gradient} rounded-t-2xl`}></div>
                    <CardContent className="p-8">
                      <div className="flex items-center mb-8">
                        <div className={`${colors.bg} p-6 rounded-3xl border ${colors.border} sleek-shadow-lg group-hover:sleek-shadow-xl transition-all`}>
                          <Icon className={`h-8 w-8 ${colors.text}`} />
                        </div>
                        <div className="ml-6 flex-1">
                          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{college.name}</h3>
                          <p className="text-sm text-slate-600 leading-relaxed mt-2 font-medium">{college.fullName}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-8 leading-relaxed text-lg font-medium">{college.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-slate-600" />
                          </div>
                          <span className="text-lg font-bold text-slate-700 tracking-tight">
                            {college.thesesCount}+ Theses
                          </span>
                        </div>
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-dlsl-green/10 transition-colors">
                          <ArrowRight className="h-6 w-6 text-slate-400 group-hover:text-dlsl-green transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
