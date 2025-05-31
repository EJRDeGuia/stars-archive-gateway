
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
  UtensilsCrossed
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

          {/* Enhanced Search Section */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Search Theses
            </h2>
            <div className="relative">
              <Command className="rounded-lg border shadow-md bg-white">
                <CommandInput 
                  placeholder="Ask me anything about theses or search by title, author, keywords..." 
                  className="border-0 focus:ring-0 text-base py-4"
                />
                <CommandList className="max-h-[400px]">
                  <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <Search className="h-8 w-8 text-gray-300" />
                      <p>No results found. Try a different search term.</p>
                    </div>
                  </CommandEmpty>
                  
                  <CommandGroup heading="Recent Searches" className="px-2">
                    {recentSearches.map((search, index) => (
                      <CommandItem key={index} className="flex items-center space-x-2 py-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{search}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  
                  <CommandGroup heading="Suggested Topics" className="px-2">
                    {suggestedTopics.map((topic, index) => (
                      <CommandItem key={index} className="flex items-center space-x-2 py-2">
                        <BookOpen className="h-4 w-4 text-dlsl-green" />
                        <span>{topic}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  
                  <CommandGroup heading="Browse by College" className="px-2">
                    {collegeData.map((college) => {
                      const colors = getCollegeColors(college.color);
                      const Icon = college.icon;
                      return (
                        <CommandItem 
                          key={college.id} 
                          className="flex items-center space-x-3 py-2"
                          onSelect={() => navigate(`/college/${college.id}`)}
                        >
                          <div className={`${colors.bg} p-1.5 rounded border ${colors.border}`}>
                            <Icon className={`h-4 w-4 ${colors.text}`} />
                          </div>
                          <div>
                            <span className="font-medium">{college.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({college.thesesCount} theses)</span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
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
                <div className="text-3xl font-bold text-gray-900">{collegeData.length}</div>
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

          {/* Colleges Grid with college-specific icons */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Browse by College</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collegeData.map((college) => {
                const colors = getCollegeColors(college.color);
                const Icon = college.icon;

                return (
                  <Card 
                    key={college.id} 
                    className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white/90 backdrop-blur-sm"
                    onClick={() => navigate(`/college/${college.id}`)}
                  >
                    <div className={`h-1 bg-gradient-to-r ${colors.gradient}`}></div>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`${colors.bg} p-3 rounded-lg border ${colors.border}`}>
                          <Icon className={`h-6 w-6 ${colors.text}`} />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">{college.name}</h3>
                          <p className="text-sm text-gray-500">{college.fullName}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{college.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          <BookOpen className="h-4 w-4 inline mr-1" />
                          {college.thesesCount}+ Theses
                        </span>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
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
