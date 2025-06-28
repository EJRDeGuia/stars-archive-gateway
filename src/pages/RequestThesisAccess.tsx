
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import FavoriteButton from '@/components/FavoriteButton';
import { 
  Search, 
  BookOpen, 
  Eye,
  Calendar,
  User,
  Building,
  Clock,
  Heart
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserFavorites } from '@/hooks/useApi';
import type { Thesis } from '@/types/thesis';

type RecentThesis = {
  id: string;
  title: string;
  author: string;
  viewed_at: string;
  theses?: {
    id: string;
    title: string;
    author: string;
    college_id: string;
    colleges?: {
      name: string;
    };
  };
};

type Favorite = {
  id: string;
  thesis_id: string;
  created_at: string;
  theses?: {
    id: string;
    title: string;
    author: string;
    abstract?: string;
    college_id: string;
    colleges?: {
      name: string;
    };
  };
};

const RequestThesisAccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all approved theses for search
  const { data: searchResults = [], isLoading: searchLoading } = useQuery({
    queryKey: ['thesis_search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      
      const { data, error } = await supabase
        .from('theses')
        .select(`
          id,
          title,
          author,
          abstract,
          college_id,
          publish_date,
          view_count,
          colleges (
            name
          )
        `)
        .eq('status', 'approved')
        .or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,abstract.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!searchTerm.trim(),
  });

  // Fetch recently viewed theses
  const { data: recentTheses = [] } = useQuery({
    queryKey: ['recent_theses', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('thesis_views')
        .select(`
          id,
          thesis_id,
          viewed_at,
          theses (
            id,
            title,
            author,
            college_id,
            colleges (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as RecentThesis[] || [];
    },
    enabled: !!user?.id,
  });

  // Fetch user favorites
  const { data: userFavorites = [] } = useUserFavorites(user?.id);
  
  // Fetch favorites with thesis details
  const { data: favoriteTheses = [] } = useQuery({
    queryKey: ["user_favorites_with_theses", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
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
            college_id,
            colleges (
              name
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Favorite[] || [];
    },
    enabled: !!user?.id,
  });

  const handleThesisClick = (thesisId: string) => {
    navigate(`/thesis/${thesisId}`);
  };

  const getFavoriteId = (thesisId: string) => {
    return userFavorites?.find(fav => fav.thesis_id === thesisId)?.id;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Thesis Access Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Search, discover, and request access to academic research from De La Salle Lipa University
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Theses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title, author, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Search Results */}
              {searchTerm && (
                <div className="mt-4">
                  {searchLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dlsl-green mx-auto"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700">Search Results ({searchResults.length})</h4>
                      {searchResults.map((thesis) => (
                        <div
                          key={thesis.id}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1" onClick={() => handleThesisClick(thesis.id)}>
                              <h5 className="font-semibold text-dlsl-green hover:underline mb-1">
                                {thesis.title}
                              </h5>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>{thesis.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Building className="w-3 h-3" />
                                  <span>{thesis.colleges?.name || 'Unknown College'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{thesis.view_count || 0} views</span>
                                </div>
                              </div>
                              {thesis.abstract && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {thesis.abstract}
                                </p>
                              )}
                            </div>
                            {user && (
                              <div className="ml-4 flex-shrink-0">
                                <FavoriteButton
                                  userId={user.id}
                                  thesisId={thesis.id}
                                  favoriteId={getFavoriteId(thesis.id)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No theses found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {user && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Recently Viewed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recently Viewed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentTheses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p>No recently viewed theses</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentTheses.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1" onClick={() => handleThesisClick(item.thesis_id)}>
                              <h6 className="font-medium text-dlsl-green hover:underline line-clamp-2 mb-1">
                                {item.theses?.title || 'Unknown Title'}
                              </h6>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{item.theses?.author || 'Unknown Author'}</span>
                                <span>•</span>
                                <span>{item.theses?.colleges?.name || 'Unknown College'}</span>
                              </div>
                            </div>
                            <div className="ml-3 flex-shrink-0">
                              <FavoriteButton
                                userId={user.id}
                                thesisId={item.thesis_id}
                                favoriteId={getFavoriteId(item.thesis_id)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* My Library */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    My Library ({favoriteTheses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {favoriteTheses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p>No saved theses yet</p>
                      <p className="text-sm">Click the heart icon on any thesis to save it</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {favoriteTheses.slice(0, 5).map((favorite) => (
                        <div
                          key={favorite.id}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1" onClick={() => handleThesisClick(favorite.thesis_id)}>
                              <h6 className="font-medium text-dlsl-green hover:underline line-clamp-2 mb-1">
                                {favorite.theses?.title || 'Unknown Title'}
                              </h6>
                              <div className="flex items-center gap-3 text-xs text-gray-500 mb-1">
                                <span>{favorite.theses?.author || 'Unknown Author'}</span>
                                <span>•</span>
                                <span>{favorite.theses?.colleges?.name || 'Unknown College'}</span>
                              </div>
                              {favorite.theses?.abstract && (
                                <p className="text-xs text-gray-600 line-clamp-1">
                                  {favorite.theses.abstract}
                                </p>
                              )}
                            </div>
                            <div className="ml-3 flex-shrink-0">
                              <FavoriteButton
                                userId={user.id}
                                thesisId={favorite.thesis_id}
                                favoriteId={favorite.id}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {favoriteTheses.length > 5 && (
                        <div className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/library')}
                            className="text-dlsl-green"
                          >
                            View all {favoriteTheses.length} saved theses
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>How to Access Theses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-dlsl-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-dlsl-green" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Search & Browse</h3>
                  <p className="text-sm text-gray-600">
                    Use the search bar to find theses by title, author, or keywords
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-dlsl-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-dlsl-green" />
                  </div>
                  <h3 className="font-semibold mb-2">2. View Details</h3>
                  <p className="text-sm text-gray-600">
                    Click on any thesis to view its abstract and details
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-dlsl-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-dlsl-green" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Request Access</h3>
                  <p className="text-sm text-gray-600">
                    Submit a request to access the full document for research purposes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RequestThesisAccess;
