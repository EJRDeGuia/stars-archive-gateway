import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Sparkles,
  Bookmark,
  User,
  Settings,
  Building,
  BookOpen,
  FileText,
  TrendingUp,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { colleges, theses } from '@/data/mockData';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      const results = theses.filter(thesis => 
        thesis.title.toLowerCase().includes(query.toLowerCase()) ||
        thesis.author.toLowerCase().includes(query.toLowerCase()) ||
        thesis.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleCollegeClick = (collegeId: string) => {
    navigate(`/college/${collegeId}`);
  };

  const handleThesisClick = (thesisId: string) => {
    navigate(`/thesis/${thesisId}`);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLibraryClick = () => {
    navigate('/library');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Welcome back, {user?.name}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore our comprehensive collection of academic research and discover groundbreaking insights.
              </p>
            </div>

            {/* ChatGPT-style Search */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Search className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <Input
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          handleSearch(e.target.value);
                        }}
                        placeholder="What would you like to research today? Ask me anything about our thesis collection..."
                        className="border-0 text-lg placeholder-gray-400 focus:ring-0 focus:border-0 h-auto py-3 px-0 bg-transparent"
                      />
                    </div>
                    {isSearching && (
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {searchResults.slice(0, 5).map((thesis) => (
                          <div 
                            key={thesis.id}
                            className="p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                            onClick={() => handleThesisClick(thesis.id)}
                          >
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{thesis.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{thesis.author}</span>
                              <span>•</span>
                              <span>{thesis.year}</span>
                              <span>•</span>
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                                {thesis.college}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                  <span>Powered by semantic search</span>
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-gray-200"
                onClick={handleLibraryClick}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">My Library</h3>
                  <p className="text-gray-600">Access your saved and bookmarked research papers</p>
                </CardContent>
              </Card>

              <Card 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-gray-200"
                onClick={handleProfileClick}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">My Profile</h3>
                  <p className="text-gray-600">Manage your account settings and preferences</p>
                </CardContent>
              </Card>

              <Card 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-gray-200"
                onClick={handleSettingsClick}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Settings className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Settings</h3>
                  <p className="text-gray-600">Customize your experience and notifications</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Colleges Grid */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Browse by College</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <Building className="w-5 h-5" />
                <span>{colleges.length} Colleges</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {colleges.map((college) => (
                <Card 
                  key={college.id} 
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-gray-200 hover:border-primary/30"
                  onClick={() => handleCollegeClick(college.id)}
                >
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                        <BookOpen className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                        {college.name}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {college.fullName}
                      </p>
                      <div className="flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-primary">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">{college.thesesCount} theses</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Uploads</h2>
            <div className="space-y-6">
              {theses.slice(0, 3).map((thesis) => (
                <Card 
                  key={thesis.id} 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-gray-200"
                  onClick={() => handleThesisClick(thesis.id)}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary transition-colors">
                          {thesis.title}
                        </h3>
                        <div className="flex items-center gap-6 text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{thesis.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{thesis.year}</span>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                            {thesis.college}
                          </Badge>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {thesis.abstract.substring(0, 200)}...
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {thesis.keywords.slice(0, 3).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="border-gray-300 text-gray-600">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="ml-6">
                        <ExternalLink className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
