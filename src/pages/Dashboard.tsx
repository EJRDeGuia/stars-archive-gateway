
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Star, 
  Filter,
  Code,
  Calculator,
  Microscope,
  HeartPulse,
  UtensilsCrossed,
  Upload,
  Library,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CollegeCard from '@/components/CollegeCard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // College data matching the landing page order and icons
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const canUpload = user?.role === 'archivist' || user?.role === 'admin';

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'upload':
        navigate('/upload');
        break;
      case 'collections':
        navigate('/collections');
        break;
      case 'library':
        navigate('/library');
        break;
      case 'trending':
        navigate('/explore');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {getGreeting()}, {user?.name || 'User'}!
            </h1>
            <p className="text-xl text-gray-600">
              Welcome back to STARS. What would you like to explore today?
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What would you like to research today? Ask me anything..."
                      className="border-0 text-lg placeholder-gray-400 focus:ring-0 focus:border-0 h-auto py-2 px-0 bg-transparent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                    />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    className="bg-dlsl-green hover:bg-dlsl-green-dark text-white rounded-xl"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Centered */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {canUpload && (
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleQuickAction('upload')}>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-dlsl-green/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-dlsl-green group-hover:scale-110 transition-all duration-300">
                        <Upload className="h-8 w-8 text-dlsl-green group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Upload Thesis</h3>
                      <p className="text-sm text-gray-600">Submit new research work</p>
                    </CardContent>
                  </Card>
                )}
                
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleQuickAction('collections')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-dlsl-green/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-dlsl-green group-hover:scale-110 transition-all duration-300">
                      <Star className="h-8 w-8 text-dlsl-green group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Collections</h3>
                    <p className="text-sm text-gray-600">Browse curated research</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleQuickAction('library')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-dlsl-green/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-dlsl-green group-hover:scale-110 transition-all duration-300">
                      <Library className="h-8 w-8 text-dlsl-green group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">My Library</h3>
                    <p className="text-sm text-gray-600">View saved research</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleQuickAction('trending')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-dlsl-green/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-dlsl-green group-hover:scale-110 transition-all duration-300">
                      <TrendingUp className="h-8 w-8 text-dlsl-green group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Trending Research</h3>
                    <p className="text-sm text-gray-600">Popular theses</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Browse by College */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Browse by College</h2>
              <Button variant="outline" onClick={() => navigate('/explore')}>
                <Filter className="mr-2 h-4 w-4 text-dlsl-green" />
                Advanced Search
              </Button>
            </div>
            
            <div className="max-w-5xl mx-auto">
              {/* Top row: CITE, CBEAM, CEAS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {collegeData.slice(0, 3).map(college => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    onClick={() => navigate(`/college/${college.id}`)}
                  />
                ))}
              </div>
              
              {/* Bottom row: CON and CIHTM centered */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {collegeData.slice(3, 5).map(college => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    onClick={() => navigate(`/college/${college.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-dlsl-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-dlsl-green" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
                <p className="text-gray-600 mb-6">Start exploring to see your activity here</p>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => navigate('/explore')} className="bg-dlsl-green hover:bg-dlsl-green/90">
                    Start Exploring
                  </Button>
                  <Button variant="outline" onClick={() => handleQuickAction('profile')}>
                    <Users className="mr-2 h-4 w-4 text-dlsl-green" />
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
