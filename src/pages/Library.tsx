
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FavoriteButton from '@/components/FavoriteButton';
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
  FolderOpen,
  Calendar,
  User,
  Building,
  Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type FavoriteThesis = {
  id: string;
  thesis_id: string;
  created_at: string;
  theses: {
    id: string;
    title: string;
    author: string;
    abstract: string;
    keywords: string[];
    publish_date: string;
    created_at: string;
    view_count: number;
    download_count: number;
    colleges: {
      id: string;
      name: string;
    };
  };
};

const Library = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('bookmarks');
  
  // Fetch user's favorites with complete thesis details
  const { data: favorites = [], isLoading, refetch } = useQuery({
    queryKey: ["user_favorites_with_theses", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('[Library] Fetching favorites for user:', user.id);
      
      const { data, error } = await supabase
        .from("user_favorites")
        .select(`
          id,
          thesis_id,
          created_at,
          theses (
            id,
            title,
            author,
            abstract,
            keywords,
            publish_date,
            created_at,
            view_count,
            download_count,
            colleges (
              id,
              name
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error('[Library] Error fetching favorites:', error);
        throw error;
      }
      
      console.log('[Library] Fetched favorites:', data);
      return data as FavoriteThesis[] || [];
    },
    enabled: !!user?.id,
  });

  // Set up real-time subscription for favorites
  useEffect(() => {
    if (!user?.id) return;

    console.log('[Library] Setting up real-time subscription for user:', user.id);
    
    const channel = supabase
      .channel('user_favorites_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_favorites',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('[Library] Real-time update received:', payload);
          // Invalidate and refetch the favorites query
          queryClient.invalidateQueries({ queryKey: ["user_favorites_with_theses", user.id] });
          refetch();
        }
      )
      .subscribe();

    return () => {
      console.log('[Library] Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient, refetch]);

  const filteredFavorites = favorites.filter(favorite => {
    if (!searchQuery) return true;
    
    const thesis = favorite.theses;
    const searchLower = searchQuery.toLowerCase();
    
    return (
      thesis?.title?.toLowerCase().includes(searchLower) ||
      thesis?.author?.toLowerCase().includes(searchLower) ||
      thesis?.abstract?.toLowerCase().includes(searchLower) ||
      thesis?.keywords?.some(keyword => 
        keyword.toLowerCase().includes(searchLower)
      ) ||
      thesis?.colleges?.name?.toLowerCase().includes(searchLower)
    );
  });

  const handleThesisClick = (thesisId: string) => {
    navigate(`/thesis/${thesisId}`);
  };

  const handleFavoriteToggle = (favoriteId: string, isFavorited: boolean) => {
    if (!isFavorited) {
      // Optimistically update the UI
      queryClient.setQueryData(
        ["user_favorites_with_theses", user?.id],
        (oldData: FavoriteThesis[] | undefined) => {
          return oldData?.filter(fav => fav.id !== favoriteId) || [];
        }
      );
      
      // Refetch to ensure consistency
      setTimeout(() => refetch(), 500);
    }
  };

  const tabs = [
    { id: 'bookmarks', label: 'My Library', count: favorites.length },
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
              {searchQuery && (
                <div className="mt-3 text-sm text-gray-600">
                  Showing {filteredFavorites.length} of {favorites.length} saved theses
                </div>
              )}
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
                  Saved Papers ({filteredFavorites.length})
                </h2>
              </div>
              
              {filteredFavorites.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {searchQuery ? 'No matching theses found' : 'No saved papers yet'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {searchQuery 
                        ? 'Try adjusting your search terms or clear the search to see all saved papers.'
                        : 'Start exploring and save theses that interest you'
                      }
                    </p>
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
                <div className="grid grid-cols-1 gap-6">
                  {filteredFavorites.map((favorite) => (
                    <Card 
                      key={favorite.id} 
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleThesisClick(favorite.thesis_id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
                              {favorite.theses?.title || 'Untitled Thesis'}
                            </h3>
                            <div className="flex items-center gap-4 text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span className="font-medium">{favorite.theses?.author || 'Unknown Author'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                <span>{favorite.theses?.colleges?.name || 'Unknown College'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {favorite.theses?.publish_date 
                                    ? new Date(favorite.theses.publish_date).getFullYear()
                                    : 'N/A'
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-2">
                            <div className="flex items-center gap-4 text-sm text-gray-500 mr-4">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{favorite.theses?.view_count || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                <span>{favorite.theses?.download_count || 0}</span>
                              </div>
                            </div>
                            <FavoriteButton
                              userId={user!.id}
                              thesisId={favorite.thesis_id}
                              favoriteId={favorite.id}
                              onToggle={(isFavorited) => handleFavoriteToggle(favorite.id, isFavorited)}
                            />
                          </div>
                        </div>
                        
                        {favorite.theses?.abstract && (
                          <p className="text-gray-700 line-clamp-3 mb-4">
                            {favorite.theses.abstract}
                          </p>
                        )}
                        
                        {favorite.theses?.keywords && favorite.theses.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {favorite.theses.keywords.slice(0, 5).map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                            {favorite.theses.keywords.length > 5 && (
                              <Badge variant="outline" className="text-xs text-gray-400">
                                +{favorite.theses.keywords.length - 5} more
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            Saved {new Date(favorite.created_at).toLocaleDateString()}
                          </p>
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleThesisClick(favorite.thesis_id);
                          }}>
                            View Thesis
                          </Button>
                        </div>
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
