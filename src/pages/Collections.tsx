
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import ThemedCollectionCarousel from '@/components/ThemedCollectionCarousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Collection = {
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

  // Sectioned collections
  const [featured, setFeatured] = useState<Collection[]>([]);
  const [trending, setTrending] = useState<Collection[]>([]);
  const [newAdditions, setNewAdditions] = useState<Collection[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);

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
    setLoadingSections(true);
    Promise.all([
      supabase
        .from('collection_highlights')
        .select('*')
        .eq('type', 'featured')
        .order('updated_at', { ascending: false }),
      supabase
        .from('collection_highlights')
        .select('*')
        .eq('type', 'trending')
        .order('updated_at', { ascending: false }),
      supabase
        .from('collection_highlights')
        .select('*')
        .eq('type', 'new')
        .order('updated_at', { ascending: false }),
    ]).then(([{ data: feat }, { data: trend }, { data: nadd }]) => {
      setFeatured(feat || []);
      setTrending(trend || []);
      setNewAdditions(nadd || []);
      setLoadingSections(false);
    });
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

          {/* Themed Collections - 3 Section Carousels */}
          <div className="mb-20">
            {loadingSections ? (
              <div className="text-gray-400 text-center py-20">
                Loading research highlights...
              </div>
            ) : (
              <>
                <ThemedCollectionCarousel
                  title="Featured Research"
                  collections={featured}
                  accentColorClass="border-green-600"
                  badgeLabel="Featured"
                  badgeClass="bg-green-600"
                />
                <ThemedCollectionCarousel
                  title="Trending this Month"
                  collections={trending}
                  accentColorClass="border-yellow-500"
                  badgeLabel="Trending"
                  badgeClass="bg-yellow-500"
                />
                <ThemedCollectionCarousel
                  title="New Additions"
                  collections={newAdditions}
                  accentColorClass="border-blue-600"
                  badgeLabel="New"
                  badgeClass="bg-blue-600"
                />
              </>
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

