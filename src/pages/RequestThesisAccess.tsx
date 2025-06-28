
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FavoriteButton from '@/components/FavoriteButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Heart,
  Download,
  Eye,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUserFavorites } from '@/hooks/useApi';
import type { Thesis } from '@/types/thesis';

interface RecentThesis extends Thesis {
  viewed_at?: string;
}

const RequestThesisAccess = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Thesis[]>([]);
  const [recentTheses, setRecentTheses] = useState<RecentThesis[]>([]);
  const [favoriteTheses, setFavoriteTheses] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(false);
  const [collegeFilter, setCollegeFilter] = useState<string>('all');
  const [colleges, setColleges] = useState<any[]>([]);

  // Fetch user favorites
  const { data: userFavorites = [] } = useUserFavorites(user?.id);

  useEffect(() => {
    fetchColleges();
    if (user) {
      fetchRecentTheses();
      fetchFavoriteTheses();
    }
  }, [user]);

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('name');
      if (error) throw error;
      setColleges(data || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const fetchRecentTheses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('thesis_views')
        .select(`
          id,
          thesis_id,
          viewed_at,
          theses!inner (
            id,
            title,
            author,
            college_id,
            abstract,
            keywords,
            status,
            publish_date,
            adviser,
            co_adviser,
            cover_image_url,
            created_at,
            download_count,
            file_url,
            view_count,
            colleges (
              id,
              name,
              description
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('theses.status', 'approved')
        .order('viewed_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Transform the data to match RecentThesis type
      const transformedData = (data || []).map(view => ({
        ...view.theses,
        viewed_at: view.viewed_at
      })) as RecentThesis[];

      setRecentTheses(transformedData);
    } catch (error) {
      console.error('Error fetching recent theses:', error);
    }
  };

  const fetchFavoriteTheses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          thesis_id,
          created_at,
          theses!inner (
            id,
            title,
            author,
            college_id,
            abstract,
            keywords,
            status,
            publish_date,
            adviser,
            co_adviser,
            cover_image_url,
            created_at,
            download_count,
            file_url,
            view_count,
            colleges (
              id,
              name,
              description
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('theses.status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match Thesis type
      const transformedData = (data || []).map(fav => fav.theses) as Thesis[];
      setFavoriteTheses(transformedData);
    } catch (error) {
      console.error('Error fetching favorite theses:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      let query = supabase
        .from('theses')
        .select(`
          *,
          colleges (
            id,
            name,
            description
          )
        `)
        .eq('status', 'approved')
        .or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%`);

      if (collegeFilter !== 'all') {
        query = query.eq('college_id', collegeFilter);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error('Failed to search theses');
    } finally {
      setLoading(false);
    }
  };

  const getFavoriteId = (thesisId: string) => {
    return userFavorites?.find(fav => fav.thesis_id === thesisId)?.id;
  };

  const ThesisCard = ({ thesis, showFavoriteButton = true }: { thesis: Thesis; showFavoriteButton?: boolean }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {thesis.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{thesis.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Building className="w-4 h-4" />
              <span>{thesis.colleges?.name || 'Unknown College'}</span>
            </div>
            {thesis.publish_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(thesis.publish_date).getFullYear()}</span>
              </div>
            )}
          </div>
          {thesis.abstract && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
              {thesis.abstract}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{thesis.view_count || 0} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{thesis.download_count || 0} downloads</span>
            </div>
          </div>
        </div>
        {showFavoriteButton && user && (
          <div className="ml-4">
            <FavoriteButton
              userId={user.id}
              thesisId={thesis.id}
              favoriteId={getFavoriteId(thesis.id)}
            />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open(`/thesis/${thesis.id}`, '_blank')}
        >
          View Details
        </Button>
        <Button 
          variant="outline" 
          size="sm"
        >
          Request Access
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Thesis Repository Access
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Search and request access to academic research papers and theses from our comprehensive digital library.
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
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search by title, author, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={collegeFilter} onValueChange={setCollegeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Colleges" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Colleges</SelectItem>
                      {colleges.map((college) => (
                        <SelectItem key={college.id} value={college.id}>
                          {college.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSearch} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Search Results ({searchResults.length})
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {searchResults.map((thesis) => (
                      <ThesisCard key={thesis.id} thesis={thesis} />
                    ))}
                  </div>
                </div>
              )}

              {searchQuery && searchResults.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No theses found matching your search criteria.
                </div>
              )}
            </CardContent>
          </Card>

          {user && (
            <>
              {/* Recently Viewed Section */}
              {recentTheses.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recently Viewed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {recentTheses.map((thesis) => (
                        <ThesisCard key={thesis.id} thesis={thesis} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* My Library Section */}
              {favoriteTheses.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-500" />
                      My Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {favoriteTheses.map((thesis) => (
                        <ThesisCard key={thesis.id} thesis={thesis} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* General Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                How to Request Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">For Students & Faculty</h3>
                  <p className="text-gray-600 text-sm">
                    Access is typically granted within 24 hours for university members. 
                    Please use your institutional email address when requesting access.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">For External Researchers</h3>
                  <p className="text-gray-600 text-sm">
                    External access requests are reviewed by our academic committee. 
                    Please provide detailed information about your research purpose.
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
