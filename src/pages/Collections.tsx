
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type FeaturedCollection = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  color: string;
  type: string;
  collection_id: string | null;
};

const Collections = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Featured collections
  const [featured, setFeatured] = useState<FeaturedCollection[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

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
    setLoadingFeatured(true);
    supabase
      .from('collection_highlights')
      .select('*')
      .eq('type', 'featured')
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        setFeatured((data as FeaturedCollection[]) || []);
        setLoadingFeatured(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Research Collections</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Curated collections of academic research organized by themes, colleges, and popularity
            </p>
          </div>

          {/* Featured Collections */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Collections</h2>
            {loadingFeatured ? (
              <div className="text-gray-400 text-center py-20">Loading featured collections...</div>
            ) : featured.length === 0 ? (
              <div className="text-gray-400 text-center py-20">No featured collections yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {featured.map((fc) => (
                  <Card
                    key={fc.id}
                    className="hover:shadow-lg transition cursor-pointer relative"
                    style={{
                      borderColor: fc.color || '#059669',
                      borderWidth: 2,
                    }}
                    onClick={() =>
                      fc.collection_id
                        ? navigate(`/collections/${fc.collection_id}`)
                        : undefined
                    }
                  >
                    {fc.image_url && (
                      <img
                        src={fc.image_url}
                        alt={fc.title}
                        className="rounded-t-lg w-full h-40 object-cover"
                        style={{
                          backgroundColor: fc.color || '#059669',
                        }}
                      />
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2" style={{ color: fc.color || '#059669' }}>
                        {fc.title}
                      </h3>
                      <div className="mb-2 text-sm text-gray-600">{fc.description}</div>
                      <Badge className="absolute top-3 right-3" style={{ backgroundColor: fc.color || '#059669', color: '#fff' }}>
                        Featured
                      </Badge>
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

