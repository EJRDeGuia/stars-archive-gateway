import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import FeaturedCollectionsCarousel from '@/components/FeaturedCollectionsCarousel';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FolderOpen, Calendar, User, Search, Filter, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useCollegesWithCounts } from '@/hooks/useCollegesWithCounts';

type Collection = {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string | null;
  _count?: {
    collection_theses: number;
  };
};

type College = {
  id: string;
  name: string;
  full_name: string;
  description: string | null;
  color: string | null;
  thesesCount?: number;
};

const Collections = () => {
  const navigate = useNavigate();
  const { data: colleges = [], isLoading: loading } = useCollegesWithCounts();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'thesis_count'>('created_at');
  const [totalTheses, setTotalTheses] = useState(0);

  useEffect(() => {
    Promise.all([fetchCollections(), fetchTotalTheses()]);
  }, []);

  useEffect(() => {
    filterAndSortCollections();
  }, [collections, searchQuery, sortBy]);


  const fetchCollections = async () => {
    setCollectionsLoading(true);
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Count theses for each collection
      const collectionsWithCounts = await Promise.all(
        (data || []).map(async (collection) => {
          const { count } = await supabase
            .from('collection_theses')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collection.id);

          return {
            ...collection,
            _count: { collection_theses: count || 0 }
          };
        })
      );

      console.log('Fetched public collections:', collectionsWithCounts);
      setCollections(collectionsWithCounts);
    } catch (error: any) {
      console.error('Error fetching collections:', error);
      toast({
        title: "Error loading collections",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCollectionsLoading(false);
    }
  };

  const fetchTotalTheses = async () => {
    try {
      const { count, error } = await supabase
        .from('theses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      if (error) throw error;
      setTotalTheses(count || 0);
    } catch (error) {
      console.error('Error fetching total theses:', error);
    }
  };

  const filterAndSortCollections = () => {
    let filtered = collections;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = collections.filter(collection =>
        collection.name.toLowerCase().includes(query) ||
        collection.description?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'thesis_count':
          return (b._count?.collection_theses || 0) - (a._count?.collection_theses || 0);
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredCollections(filtered);
  };

  const handleCollectionClick = (collectionId: string) => {
    navigate(`/collection/${collectionId}`);
  };

  const handleRefresh = async () => {
    await Promise.all([fetchCollections(), fetchTotalTheses()]);
    toast({
      title: "Data refreshed",
      description: "All collections and statistics have been updated."
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Research Collections</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Curated collections of academic research organized by themes, colleges, and topics
            </p>
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="flex items-center gap-2"
                disabled={loading || collectionsLoading}
              >
                <RefreshCw className={`w-4 h-4 ${(loading || collectionsLoading) ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Search and Filter for Collections */}
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search collections by name or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-600" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dlsl-green"
                    >
                      <option value="created_at">Newest First</option>
                      <option value="name">Name A-Z</option>
                      <option value="thesis_count">Most Theses</option>
                    </select>
                  </div>
                </div>
                
                {searchQuery && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Found {filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''} matching "{searchQuery}"
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Clear search
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Featured Collections Carousel */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {searchQuery ? 'Search Results' : 'Featured Collections'}
              </h2>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  <span>{filteredCollections.length} Collections</span>
                </div>
                {!searchQuery && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{filteredCollections.reduce((sum, c) => sum + (c._count?.collection_theses || 0), 0)} Total Items</span>
                  </div>
                )}
              </div>
            </div>
            
            {collectionsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dlsl-green mx-auto mb-4"></div>
                <p className="text-gray-600">Loading collections...</p>
              </div>
            ) : filteredCollections.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {searchQuery ? 'No collections found' : 'No collections available'}
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery 
                      ? 'Try adjusting your search terms to find what you\'re looking for.'
                      : 'Collections will appear here once they are created and made public.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCollections.map((collection) => (
                  <Card 
                    key={collection.id} 
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-md"
                    onClick={() => handleCollectionClick(collection.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {collection.name}
                          </h3>
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="secondary" className="bg-dlsl-green/10 text-dlsl-green">
                              Public
                            </Badge>
                            <div className="flex items-center text-sm text-gray-500">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {collection._count?.collection_theses || 0} theses
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {collection.description || 'No description available.'}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Created {formatDate(collection.created_at)}
                        </div>
                        {collection.updated_at && collection.updated_at !== collection.created_at && (
                          <div className="flex items-center">
                            Updated {formatDate(collection.updated_at)}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* College Collections */}
          {!searchQuery && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Browse by College</h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-5 h-5" />
                  <span>{colleges.length} Colleges</span>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dlsl-green mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading colleges...</p>
                </div>
              ) : colleges.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No colleges available</h3>
                    <p className="text-gray-500">
                      College information will appear here once configured.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {colleges.slice(0, 3).map(college => (
                       <CollegeCard
                         key={college.id}
                         college={college}
                         onClick={() => navigate(`/college/${college.id}`)}
                       />
                    ))}
                  </div>
                  {colleges.length > 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                       {colleges.slice(3, 5).map(college => (
                         <CollegeCard
                           key={college.id}
                           college={college}
                           onClick={() => navigate(`/college/${college.id}`)}
                         />
                       ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Statistics */}
          {!searchQuery && (
            <div className="bg-white rounded-3xl p-12 border border-gray-200 shadow-sm">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Repository Statistics</h2>
                <p className="text-lg text-gray-600">Explore our growing collection of academic research</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-dlsl-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="h-8 w-8 text-dlsl-green" />
                  </div>
                  <div className="text-3xl font-bold text-dlsl-green mb-2">{collections.length}</div>
                  <div className="text-gray-600">Public Collections</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{colleges.length}</div>
                  <div className="text-gray-600">Colleges</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{totalTheses}</div>
                  <div className="text-gray-600">Total Theses</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-gray-600">Access Available</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
