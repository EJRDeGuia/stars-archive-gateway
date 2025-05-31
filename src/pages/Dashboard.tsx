
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
  Award
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
  const [searchOpen, setSearchOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-2xl shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-dlsl-green to-dlsl-green-light bg-clip-text text-transparent">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access thesis repositories across all De La Salle Lipa colleges
            </p>
          </div>

          {/* Enhanced Search Section */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-dlsl-green/5 to-dlsl-green-light/5 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <div className="w-10 h-10 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-lg flex items-center justify-center mr-3">
                  <Search className="h-5 w-5 text-white" />
                </div>
                Intelligent Thesis Search
              </h2>
              <div className="relative">
                <Command className="rounded-xl border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
                  <CommandInput 
                    placeholder="Ask me anything about theses or search by title, author, keywords..." 
                    className="border-0 focus:ring-0 text-lg py-6 bg-transparent"
                  />
                  <CommandList className="max-h-[400px]">
                    <CommandEmpty className="py-8 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Search className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-lg font-medium">No results found</p>
                        <p className="text-sm">Try a different search term or browse by college below</p>
                      </div>
                    </CommandEmpty>
                    
                    <CommandGroup heading="Recent Searches" className="px-3">
                      {recentSearches.map((search, index) => (
                        <CommandItem key={index} className="flex items-center space-x-3 py-3 rounded-lg">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Clock className="h-4 w-4 text-gray-400" />
                          </div>
                          <span className="text-gray-700">{search}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    
                    <CommandGroup heading="Suggested Topics" className="px-3">
                      {suggestedTopics.map((topic, index) => (
                        <CommandItem key={index} className="flex items-center space-x-3 py-3 rounded-lg">
                          <div className="w-8 h-8 bg-dlsl-green/10 rounded-full flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-dlsl-green" />
                          </div>
                          <span className="text-gray-700">{topic}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    
                    <CommandGroup heading="Browse by College" className="px-3">
                      {collegeData.map((college) => {
                        const colors = getCollegeColors(college.color);
                        const Icon = college.icon;
                        return (
                          <CommandItem 
                            key={college.id} 
                            className="flex items-center space-x-4 py-3 rounded-lg cursor-pointer"
                            onSelect={() => navigate(`/college/${college.id}`)}
                          >
                            <div className={`${colors.bg} p-2 rounded-lg border ${colors.border}`}>
                              <Icon className={`h-5 w-5 ${colors.text}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-gray-800">{college.name}</span>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {college.thesesCount} theses
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{college.fullName}</p>
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          {availableActions.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {availableActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} h-auto p-6 flex flex-col items-start space-y-3 transition-all duration-300 transform hover:scale-105 border-0`}
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="text-left space-y-1">
                      <div className="font-bold text-lg">{action.title}</div>
                      <div className="text-sm opacity-90 leading-relaxed">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-white to-green-50/50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-700">Total Theses</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{totalTheses.toLocaleString()}</div>
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span>Across all colleges</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-blue-50/50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-700">Active Colleges</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <BarChart className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{collegeData.length}</div>
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                  <span>Contributing to repository</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-purple-50/50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-700">Your Access Level</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2 capitalize">{user?.role}</div>
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 mr-1 text-purple-500" />
                  <span>Your current permissions</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent & Bookmarked */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-lg flex items-center justify-center mr-3">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    Recently Viewed
                  </h3>
                  <Button variant="ghost" size="sm" className="text-dlsl-green hover:bg-dlsl-green/10">
                    View all
                  </Button>
                </div>
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 leading-relaxed">Artificial Intelligence Applications in Educational Technology</h4>
                    <p className="text-sm text-gray-500">Viewed 2 hours ago • CITE</p>
                  </div>
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 leading-relaxed">Blockchain Technology for Secure Academic Credential Verification</h4>
                    <p className="text-sm text-gray-500">Viewed 5 hours ago • CITE</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 leading-relaxed">Impact of Digital Marketing Strategies on SMEs in the Philippines</h4>
                    <p className="text-sm text-gray-500">Viewed yesterday • CBEAM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-lg flex items-center justify-center mr-3">
                      <Bookmark className="h-5 w-5 text-white" />
                    </div>
                    Bookmarked Theses
                  </h3>
                  <Button variant="ghost" size="sm" className="text-dlsl-green hover:bg-dlsl-green/10">
                    View all
                  </Button>
                </div>
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="h-10 w-10 text-gray-300" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-3">No bookmarks yet</h4>
                  <p className="text-gray-500 mb-6 leading-relaxed">You haven't saved any theses to your bookmarks</p>
                  <Button className="bg-dlsl-green hover:bg-dlsl-green-dark text-white px-6 py-3">
                    Browse Theses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colleges Grid with college-specific icons */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Browse by College</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collegeData.map((college) => {
                const colors = getCollegeColors(college.color);
                const Icon = college.icon;

                return (
                  <Card 
                    key={college.id} 
                    className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm transform hover:scale-105"
                    onClick={() => navigate(`/college/${college.id}`)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className={`${colors.bg} p-4 rounded-2xl border ${colors.border} shadow-lg`}>
                          <Icon className={`h-8 w-8 ${colors.text}`} />
                        </div>
                        <div className="ml-6 flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{college.name}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">{college.fullName}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-6 leading-relaxed">{college.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {college.thesesCount}+ Theses
                          </span>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-dlsl-green/10 transition-colors">
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-dlsl-green transition-colors" />
                        </div>
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
