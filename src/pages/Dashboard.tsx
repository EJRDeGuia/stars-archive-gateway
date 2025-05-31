
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md" 
          style={{
            backgroundImage: `url(/lovable-uploads/83b8c064-b1bc-4c93-b353-78a1467e8d8d.png)`,
            filter: 'brightness(1.1) contrast(1.1)',
            transform: 'scale(1.1)'
          }}
        ></div>
        
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,100,0,0.3) 0.5px, transparent 0)`,
          backgroundSize: '12px 12px',
          backgroundPosition: '6px 6px'
        }}></div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-green-700/20 to-emerald-800/25"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-30">
        <Header />
        
        <main className="flex-1 animate-fade-in">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
            {/* Hero Section */}
            <div className="text-center mb-24 animate-slide-up">
              <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-dlsl-green via-dlsl-green-light to-emerald-400 rounded-3xl sleek-shadow-xl mb-10 transform hover:scale-105 transition-all duration-300">
                <Award className="w-14 h-14 text-white" />
              </div>
              <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent mb-10 leading-tight tracking-tight drop-shadow-2xl">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg">
                Discover and explore thesis repositories across all De La Salle Lipa colleges with our AI-powered research assistant
              </p>
            </div>

            {/* Enhanced Search Section */}
            <div className="mb-24 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <SearchInterface 
                onSearch={(query) => console.log('Search:', query)}
                className="max-w-6xl mx-auto"
              />
            </div>

            {/* Quick Actions */}
            {availableActions.length > 0 && (
              <div className="mb-24 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-5xl font-bold text-white mb-16 text-center tracking-tight drop-shadow-lg">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {availableActions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={action.action}
                      className={`bg-gradient-to-br ${action.color} text-white h-auto p-10 flex flex-col items-start space-y-8 transition-all duration-300 transform hover:scale-105 border-0 rounded-3xl sleek-shadow-xl hover:sleek-shadow-2xl group`}
                    >
                      <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <action.icon className="h-10 w-10" />
                      </div>
                      <div className="text-left space-y-4">
                        <div className="font-bold text-2xl tracking-tight">{action.title}</div>
                        <div className="text-sm opacity-90 leading-relaxed font-medium">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Card className="glass-effect border-white/20 sleek-shadow-xl rounded-3xl overflow-hidden hover:sleek-shadow-2xl transition-all duration-300 transform hover:scale-105 group">
                <CardContent className="p-10">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-bold text-white tracking-tight">Total Theses</h3>
                    <div className="w-20 h-20 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-3xl flex items-center justify-center sleek-shadow-lg group-hover:sleek-shadow-xl transition-all">
                      <BookOpen className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="text-6xl font-bold text-white mb-6 tracking-tight">{totalTheses.toLocaleString()}</div>
                  <div className="flex items-center text-lg text-green-100 font-medium">
                    <TrendingUp className="h-5 w-5 mr-3 text-green-300" />
                    <span>Across all colleges</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-white/20 sleek-shadow-xl rounded-3xl overflow-hidden hover:sleek-shadow-2xl transition-all duration-300 transform hover:scale-105 group">
                <CardContent className="p-10">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-bold text-white tracking-tight">Active Colleges</h3>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center sleek-shadow-lg group-hover:sleek-shadow-xl transition-all">
                      <BarChart className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="text-6xl font-bold text-white mb-6 tracking-tight">{collegeData.length}</div>
                  <div className="flex items-center text-lg text-blue-100 font-medium">
                    <TrendingUp className="h-5 w-5 mr-3 text-blue-300" />
                    <span>Contributing to repository</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-white/20 sleek-shadow-xl rounded-3xl overflow-hidden hover:sleek-shadow-2xl transition-all duration-300 transform hover:scale-105 group">
                <CardContent className="p-10">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-bold text-white tracking-tight">Your Access</h3>
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center sleek-shadow-lg group-hover:sleek-shadow-xl transition-all">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="text-6xl font-bold text-white mb-6 capitalize tracking-tight">{user?.role}</div>
                  <div className="flex items-center text-lg text-purple-100 font-medium">
                    <Award className="h-5 w-5 mr-3 text-purple-300" />
                    <span>Current permissions</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent & Bookmarked */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Card className="glass-effect border-white/20 sleek-shadow-xl rounded-3xl">
                <CardContent className="p-10">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-3xl font-bold flex items-center text-white">
                      <div className="w-16 h-16 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-2xl flex items-center justify-center mr-6 sleek-shadow-lg">
                        <Clock className="h-8 w-8 text-white" />
                      </div>
                      Recently Viewed
                    </h3>
                    <Button variant="ghost" size="sm" className="text-dlsl-green hover:bg-dlsl-green/10 rounded-xl text-lg">
                      View all
                    </Button>
                  </div>
                  <div className="space-y-8">
                    <div className="border-b border-white/20 pb-8">
                      <h4 className="font-bold text-white mb-4 text-xl leading-relaxed">Artificial Intelligence Applications in Educational Technology</h4>
                      <p className="text-lg text-white/70">Viewed 2 hours ago • CITE</p>
                    </div>
                    <div className="border-b border-white/20 pb-8">
                      <h4 className="font-bold text-white mb-4 text-xl leading-relaxed">Blockchain Technology for Secure Academic Credential Verification</h4>
                      <p className="text-lg text-white/70">Viewed 5 hours ago • CITE</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-4 text-xl leading-relaxed">Impact of Digital Marketing Strategies on SMEs in the Philippines</h4>
                      <p className="text-lg text-white/70">Viewed yesterday • CBEAM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-white/20 sleek-shadow-xl rounded-3xl">
                <CardContent className="p-10">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-3xl font-bold flex items-center text-white">
                      <div className="w-16 h-16 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-2xl flex items-center justify-center mr-6 sleek-shadow-lg">
                        <Bookmark className="h-8 w-8 text-white" />
                      </div>
                      Bookmarked Theses
                    </h3>
                    <Button variant="ghost" size="sm" className="text-dlsl-green hover:bg-dlsl-green/10 rounded-xl text-lg">
                      View all
                    </Button>
                  </div>
                  <div className="text-center py-20">
                    <div className="w-32 h-32 glass-effect rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
                      <Bookmark className="h-16 w-16 text-white/60" />
                    </div>
                    <h4 className="text-3xl font-bold text-white mb-6">No bookmarks yet</h4>
                    <p className="text-white/80 mb-10 leading-relaxed text-xl">You haven't saved any theses to your bookmarks</p>
                    <Button className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark hover:from-dlsl-green-dark hover:to-dlsl-green text-white px-10 py-6 rounded-2xl text-xl sleek-shadow-xl hover:sleek-shadow-2xl transition-all duration-300 transform hover:scale-105">
                      Browse Theses
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Colleges Grid */}
            <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-5xl font-bold text-white mb-16 text-center tracking-tight drop-shadow-lg">Browse by College</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {collegeData.map((college) => {
                  const colors = getCollegeColors(college.color);
                  const Icon = college.icon;

                  return (
                    <Card 
                      key={college.id} 
                      className="group cursor-pointer hover:sleek-shadow-2xl transition-all duration-300 border-white/20 glass-effect rounded-3xl transform hover:scale-105 sleek-shadow-xl overflow-hidden"
                      onClick={() => navigate(`/college/${college.id}`)}
                    >
                      <div className={`h-3 bg-gradient-to-r ${college.gradient} rounded-t-3xl`}></div>
                      <CardContent className="p-10">
                        <div className="flex items-center mb-10">
                          <div className={`glass-effect p-8 rounded-3xl border border-white/30 sleek-shadow-lg group-hover:sleek-shadow-xl transition-all`}>
                            <Icon className={`h-10 w-10 text-white`} />
                          </div>
                          <div className="ml-8 flex-1">
                            <h3 className="text-3xl font-bold text-white tracking-tight">{college.name}</h3>
                            <p className="text-lg text-white/80 leading-relaxed mt-3 font-medium">{college.fullName}</p>
                          </div>
                        </div>
                        <p className="text-white/90 mb-10 leading-relaxed text-xl font-medium">{college.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 glass-effect rounded-full flex items-center justify-center border border-white/20">
                              <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                              {college.thesesCount}+ Theses
                            </span>
                          </div>
                          <div className="w-16 h-16 glass-effect rounded-full flex items-center justify-center group-hover:bg-dlsl-green/10 transition-colors border border-white/20">
                            <ArrowRight className="h-8 w-8 text-white/70 group-hover:text-dlsl-green transition-colors" />
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
    </div>
  );
};

export default Dashboard;
