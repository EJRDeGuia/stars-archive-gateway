
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  BookOpen, 
  Heart, 
  Download, 
  Plus,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserFavorites } from '@/hooks/useApi';

const Library = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('bookmarks');
  
  // Get user's favorites
  const { data: userFavorites = [], isLoading } = useUserFavorites(user?.id);

  const filteredItems = (items: any[]) => {
    return items.filter(item => 
      (item.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      item.author?.toLowerCase()?.includes(searchQuery.toLowerCase()))
    );
  };

  const handleThesisClick = (thesisId: string) => {
    navigate(`/thesis/${thesisId}`);
  };

  const tabs = [
    { id: 'bookmarks', label: 'Bookmarks', count: userFavorites.length },
    { id: 'downloads', label: 'Downloads', count: 0 },
    { id: 'collections', label: 'Collections', count: 0 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dlsl-green mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your library...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="ghost" 
              className="mb-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Dashboard
            </Button>
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">My Library</h1>
                <p className="text-xl text-gray-600">Your saved research papers and collections</p>
              </div>
              <Button 
                className="bg-dlsl-green hover:bg-dlsl-green/90 text-white"
                onClick={() => navigate('/collections')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Browse Collections
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your library..."
                    className="pl-12 h-12 border-gray-300 focus:border-dlsl-green"
                  />
                </div>
                <Button variant="outline" className="h-12 border-gray-300">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <Badge variant="secondary" className="bg-gray-200 text-gray-600 border-0">
                    {tab.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Bookmarked Papers ({userFavorites.length})
                </h2>
              </div>
              
              {userFavorites.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookmarks yet</h3>
                    <p className="text-gray-500 mb-6">Start exploring and bookmark theses that interest you</p>
                    <Button 
                      onClick={() => navigate('/explore')}
                      className="bg-dlsl-green hover:bg-dlsl-green/90"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Explore Theses
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userFavorites.map((favorite) => (
                    <Card 
                      key={favorite.id} 
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleThesisClick(favorite.thesis_id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <BookOpen className="h-6 w-6 text-dlsl-green" />
                          <Heart className="h-5 w-5 text-red-500 fill-current" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          Thesis #{favorite.thesis_id.slice(0, 8)}...
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Added {new Date(favorite.created_at).toLocaleDateString()}
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          View Thesis
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Downloaded Papers (0)
                </h2>
              </div>
              <Card className="text-center py-12">
                <CardContent>
                  <Download className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No downloads yet</h3>
                  <p className="text-gray-500 mb-6">Download theses to access them offline</p>
                  <Button 
                    onClick={() => navigate('/explore')}
                    className="bg-dlsl-green hover:bg-dlsl-green/90"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Explore Theses
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'collections' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Collections (0)</h2>
              </div>
              <Card className="text-center py-12">
                <CardContent>
                  <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No collections yet</h3>
                  <p className="text-gray-500 mb-6">Organize your research with curated collections</p>
                  <Button 
                    onClick={() => navigate('/collections')}
                    className="bg-dlsl-green hover:bg-dlsl-green/90"
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Browse Collections
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Library;
