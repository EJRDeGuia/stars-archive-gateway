import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import FeaturedCollectionsCarousel from '@/components/FeaturedCollectionsCarousel';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, FolderOpen, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

const Collections = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<any[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  useEffect(() => {
    fetchColleges();
    fetchCollections();
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setColleges(data || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

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
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setCollectionsLoading(false);
    }
  };

  const handleCollectionClick = (collectionId: string) => {
    navigate(`/collection/${collectionId}`);
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
          </div>

          {/* Featured Collections Carousel */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Collections</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <FolderOpen className="w-5 h-5" />
                <span>{collections.length} Public Collections</span>
              </div>
            </div>
            
            <FeaturedCollectionsCarousel 
              collections={collections} 
              loading={collectionsLoading} 
            />
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
                      college={{
                        ...college,
                        thesesCount: college.thesesCount || 0,
                        icon: null,
                        bgColor: college.color || 'bg-gray-200',
                        bgColorLight: 'bg-gray-50',
                        textColor: 'text-gray-700',
                        borderColor: 'border-gray-200',
                        description: college.description || `Explore research from ${college.name}`,
                      }}
                      onClick={() => navigate(`/college/${college.id}`)}
                    />
                  ))}
                </div>
                {colleges.length > 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {colleges.slice(3, 5).map(college => (
                      <CollegeCard
                        key={college.id}
                        college={{
                          ...college,
                          thesesCount: college.thesesCount || 0,
                          icon: null,
                          bgColor: college.color || 'bg-gray-200',
                          bgColorLight: 'bg-gray-50',
                          textColor: 'text-gray-700',
                          borderColor: 'border-gray-200',
                          description: college.description || `Explore research from ${college.name}`,
                        }}
                        onClick={() => navigate(`/college/${college.id}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Statistics */}
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
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {collections.reduce((sum, c) => sum + (c._count?.collection_theses || 0), 0)}
                </div>
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
