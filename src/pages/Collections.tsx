
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Collection = {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  _count?: {
    collection_theses: number;
  };
};

const Collections = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<any[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('colleges')
      .select('*')
      .order('name', { ascending: true })
      .then(({ data }) => {
        setColleges(data || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      setCollectionsLoading(true);
      try {
        const { data, error } = await supabase
          .from('collections')
          .select(`
            *,
            collection_theses(count)
          `)
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

        setCollections(collectionsWithCounts);
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setCollectionsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Research Collections</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Curated collections of academic research organized by themes, colleges, and popularity
            </p>
          </div>

          {/* Research Collections */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Collections</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <FolderOpen className="w-5 h-5" />
                <span>{collections.length} Collections</span>
              </div>
            </div>
            
            {collectionsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dlsl-green mx-auto mb-4"></div>
                <p className="text-gray-600">Loading collections...</p>
              </div>
            ) : collections.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No collections available</h3>
                  <p className="text-gray-500">
                    Collections will appear here once they are created and made public by archivists.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <Card key={collection.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{collection.name}</h3>
                        <Badge variant="default" className="bg-dlsl-green">
                          Public
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {collection.description || 'No description available.'}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {collection._count?.collection_theses || 0} theses
                        </div>
                        <span>
                          {new Date(collection.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* College Collections */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Browse by College</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="w-5 h-5" />
                <span>{colleges.length} Colleges</span>
              </div>
            </div>
            <div className="max-w-5xl mx-auto">
              {loading && (
                <div className="text-center py-12 text-gray-400">Loading colleges...</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {colleges.slice(0, 3).map(college => (
                  <CollegeCard
                    key={college.id}
                    college={{
                      ...college,
                      thesesCount: college.thesesCount || 0,
                      icon: null,
                      bgColor: 'bg-gray-200',
                      bgColorLight: 'bg-gray-50',
                      textColor: 'text-gray-700',
                      borderColor: 'border-gray-200',
                      description: college.description,
                    }}
                    onClick={() => navigate(`/college/${college.id}`)}
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {colleges.slice(3, 5).map(college => (
                  <CollegeCard
                    key={college.id}
                    college={{
                      ...college,
                      thesesCount: college.thesesCount || 0,
                      icon: null,
                      bgColor: 'bg-gray-200',
                      bgColorLight: 'bg-gray-50',
                      textColor: 'text-gray-700',
                      borderColor: 'border-gray-200',
                      description: college.description,
                    }}
                    onClick={() => navigate(`/college/${college.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-3xl p-12 border border-gray-200 shadow-sm">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Repository Statistics</h2>
              <p className="text-lg text-gray-600">Statistics not available.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center text-gray-300">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-300 mb-2">—</div>
                  <div className="text-gray-300">Empty</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
