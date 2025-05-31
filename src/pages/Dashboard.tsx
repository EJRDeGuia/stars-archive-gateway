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
  Search,
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
  Send,
  Sparkles
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const quickActions = [
    {
      title: 'Upload Thesis',
      description: 'Add new thesis to the repository',
      icon: Upload,
      action: () => navigate('/upload'),
      roles: ['archivist', 'admin'],
      color: 'bg-gradient-to-br from-dlsl-green to-dlsl-green-light text-white hover:shadow-xl hover:shadow-green-200/50'
    },
    {
      title: 'System Settings',
      description: 'Manage system configuration',
      icon: Settings,
      action: () => console.log('Navigate to settings'),
      roles: ['admin'],
      color: 'bg-gradient-to-br from-dlsl-gold to-yellow-400 text-dlsl-green-dark hover:shadow-xl hover:shadow-yellow-200/50'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Users,
      action: () => console.log('Navigate to user management'),
      roles: ['admin'],
      color: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl hover:shadow-blue-200/50'
    },
    {
      title: 'Database Backup',
      description: 'System backup and maintenance',
      icon: Database,
      action: () => console.log('Navigate to backup'),
      roles: ['admin'],
      color: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl hover:shadow-purple-200/50'
    }
  ];

  const availableActions = quickActions.filter(action => 
    action.roles.includes(user?.role || 'researcher')
  );

  const totalTheses = colleges.reduce((sum, college) => sum + college.thesesCount, 0);

  // Map college data with specific icons and colors like the landing page
  const collegeData = [
    {
      id: '1',
      name: 'CITE',
      fullName: 'College of Information Technology and Engineering',
      color: 'red',
      thesesCount: 120,
      icon: Code,
      description: 'Advancing technology through innovative research'
    },
    {
      id: '2',
      name: 'CBEAM',
      fullName: 'College of Business, Economics, Accountancy, and Management',
      color: 'yellow',
      thesesCount: 145,
      icon: Calculator,
      description: 'Driving business excellence and economic growth'
    },
    {
      id: '3',
      name: 'CEAS',
      fullName: 'College of Education, Arts, and Sciences',
      color: 'blue',
      thesesCount: 98,
      icon: Microscope,
      description: 'Exploring knowledge across diverse disciplines'
    },
    {
      id: '4',
      name: 'CON',
      fullName: 'College of Nursing',
      color: 'gray',
      thesesCount: 76,
      icon: HeartPulse,
      description: 'Advancing healthcare through compassionate research'
    },
    {
      id: '5',
      name: 'CIHTM',
      fullName: 'College of International Hospitality and Tourism Management',
      color: 'green',
      thesesCount: 110,
      icon: UtensilsCrossed,
      description: 'Shaping the future of hospitality and tourism'
    }
  ];

  const getCollegeColors = (color: string) => {
    switch (color) {
      case 'red':
        return {
          gradient: 'from-red-500 to-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-600',
          hover: 'hover:shadow-red-100'
        };
      case 'yellow':
        return {
          gradient: 'from-yellow-500 to-amber-500',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-600',
          hover: 'hover:shadow-yellow-100'
        };
      case 'blue':
        return {
          gradient: 'from-blue-500 to-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-600',
          hover: 'hover:shadow-blue-100'
        };
      case 'green':
        return {
          gradient: 'from-green-500 to-emerald-500',
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-600',
          hover: 'hover:shadow-green-100'
        };
      default:
        return {
          gradient: 'from-gray-500 to-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-600',
          hover: 'hover:shadow-gray-100'
        };
    }
  };

  const recentSearches = [
    "Artificial Intelligence in Education",
    "Blockchain Technology",
    "Digital Marketing Strategies",
    "Sustainable Tourism",
    "Healthcare Innovation"
  ];

  const suggestedTopics = [
    "Machine Learning",
    "Business Analytics",
    "Environmental Science",
    "Nursing Research",
    "Hospitality Management"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-dlsl-green via-dlsl-green-light to-emerald-400 rounded-3xl shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-300">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-dlsl-green via-dlsl-green-light to-emerald-500 bg-clip-text text-transparent mb-6 leading-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover and explore thesis repositories across all De La Salle Lipa colleges with our intelligent search system
            </p>
          </div>

          {/* ChatGPT-style Search Section */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden backdrop-blur-sm">
                <div className="p-8 pb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-2xl flex items-center justify-center shadow-lg">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">AI-Powered Research Assistant</h2>
                      <p className="text-slate-600">Ask anything about theses or search by keywords, authors, and topics</p>
                    </div>
                  </div>
                  
                  {/* Main Search Input */}
                  <div className="relative mb-6">
                    <div className="flex items-center bg-slate-50 rounded-2xl border-2 border-slate-200 focus-within:border-dlsl-green focus-within:bg-white transition-all duration-300 shadow-sm hover:shadow-md">
                      <div className="pl-6">
                        <Search className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Ask me anything about theses or search by title, author, keywords..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="flex-1 bg-transparent px-4 py-6 text-lg text-slate-800 placeholder-slate-500 focus:outline-none"
                      />
                      <div className="pr-4">
                        <Button 
                          size="sm" 
                          className="bg-dlsl-green hover:bg-dlsl-green-dark text-white rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Suggestions */}
                <div className="border-t border-slate-100 bg-slate-50/50">
                  <Command className="bg-transparent border-0">
                    <CommandList className="max-h-80">
                      <CommandEmpty className="py-8 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                            <Search className="h-8 w-8 text-slate-300" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-slate-700">No results found</p>
                            <p className="text-sm text-slate-500 mt-1">Try a different search term or browse suggestions below</p>
                          </div>
                        </div>
                      </CommandEmpty>
                      
                      <CommandGroup heading="🕒 Recent Searches" className="px-4 py-2">
                        {recentSearches.map((search, index) => (
                          <CommandItem 
                            key={index} 
                            className="flex items-center space-x-4 py-3 px-4 rounded-xl hover:bg-white transition-colors cursor-pointer"
                          >
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                              <Clock className="h-4 w-4 text-slate-500" />
                            </div>
                            <span className="text-slate-700 font-medium">{search}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      
                      <CommandGroup heading="💡 Suggested Topics" className="px-4 py-2">
                        {suggestedTopics.map((topic, index) => (
                          <CommandItem 
                            key={index} 
                            className="flex items-center space-x-4 py-3 px-4 rounded-xl hover:bg-white transition-colors cursor-pointer"
                          >
                            <div className="w-8 h-8 bg-dlsl-green/10 rounded-full flex items-center justify-center">
                              <BookOpen className="h-4 w-4 text-dlsl-green" />
                            </div>
                            <span className="text-slate-700 font-medium">{topic}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      
                      <CommandGroup heading="🏛️ Browse by College" className="px-4 py-2">
                        {collegeData.map((college) => {
                          const colors = getCollegeColors(college.color);
                          const Icon = college.icon;
                          return (
                            <CommandItem 
                              key={college.id} 
                              className="flex items-center space-x-4 py-4 px-4 rounded-xl hover:bg-white transition-colors cursor-pointer"
                              onSelect={() => navigate(`/college/${college.id}`)}
                            >
                              <div className={`${colors.bg} p-3 rounded-xl border ${colors.border} shadow-sm`}>
                                <Icon className={`h-5 w-5 ${colors.text}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-slate-800">{college.name}</span>
                                  <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                    {college.thesesCount} theses
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">{college.fullName}</p>
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {availableActions.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {availableActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} h-auto p-8 flex flex-col items-start space-y-4 transition-all duration-300 transform hover:scale-105 border-0 rounded-2xl shadow-xl hover:shadow-2xl`}
                  >
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <action.icon className="h-7 w-7" />
                    </div>
                    <div className="text-left space-y-2">
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
            <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-700">Total Theses</h3>
                  <div className="w-14 h-14 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-3">{totalTheses.toLocaleString()}</div>
                <div className="flex items-center text-sm text-slate-600">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                  <span>Across all colleges</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-700">Active Colleges</h3>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BarChart className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-3">{collegeData.length}</div>
                <div className="flex items-center text-sm text-slate-600">
                  <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Contributing to repository</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-700">Your Access Level</h3>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-3 capitalize">{user?.role}</div>
                <div className="flex items-center text-sm text-slate-600">
                  <Award className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Your current permissions</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent & Bookmarked */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
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
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Browse by College</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collegeData.map((college) => {
                const colors = getCollegeColors(college.color);
                const Icon = college.icon;

                return (
                  <Card 
                    key={college.id} 
                    className="group cursor-pointer hover:shadow-3xl transition-all duration-300 border-0 bg-white rounded-2xl transform hover:scale-105 shadow-xl"
                    onClick={() => navigate(`/college/${college.id}`)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${colors.gradient} rounded-t-2xl`}></div>
                    <CardContent className="p-8">
                      <div className="flex items-center mb-8">
                        <div className={`${colors.bg} p-5 rounded-3xl border ${colors.border} shadow-lg`}>
                          <Icon className={`h-8 w-8 ${colors.text}`} />
                        </div>
                        <div className="ml-6 flex-1">
                          <h3 className="text-2xl font-bold text-slate-900">{college.name}</h3>
                          <p className="text-sm text-slate-600 leading-relaxed mt-1">{college.fullName}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-8 leading-relaxed text-lg">{college.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-slate-600" />
                          </div>
                          <span className="text-lg font-bold text-slate-700">
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
