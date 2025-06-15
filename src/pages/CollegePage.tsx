
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  User, 
  Search,
  Filter,
  ExternalLink,
  TrendingUp,
  Eye,
  Heart,
  Sparkles,
  Code,
  Calculator,
  Microscope,
  HeartPulse,
  UtensilsCrossed
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const thesisDemo = [
  // Optionally add demo theses here for UI, or use your own real thesis fetching logic elsewhere
];

const iconMap: Record<string, any> = {
  'CITE': Code,
  'CBEAM': Calculator,
  'CEAS': Microscope,
  'CON': HeartPulse,
  'CIHTM': UtensilsCrossed,
};

const colorMap: Record<string, string> = {
  'CITE': 'text-red-600',
  'CBEAM': 'text-yellow-600',
  'CEAS': 'text-blue-600',
  'CON': 'text-gray-600',
  'CIHTM': 'text-green-600',
};

const bgMap: Record<string, string> = {
  'CITE': 'from-red-900/60 via-red-700/40 to-red-500/60',
  'CBEAM': 'from-yellow-900/60 via-yellow-700/40 to-yellow-500/60',
  'CEAS': 'from-blue-900/60 via-blue-700/40 to-blue-500/60',
  'CON': 'from-gray-900/60 via-gray-700/40 to-gray-500/60',
  'CIHTM': 'from-green-900/60 via-green-700/40 to-green-500/60',
};

const CollegePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [collegesError, setCollegesError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [theses, setTheses] = useState<any[]>([]);
  const [thesisLoading, setThesisLoading] = useState(false);
  const [thesisError, setThesisError] = useState<string | null>(null);

  // Fetch college info
  useEffect(() => {
    setLoading(true);
    setCollegesError(null);
    supabase
      .from('colleges')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        setLoading(false);
        if (error) { setCollegesError('College not found'); return; }
        setCollege(data);
      });
  }, [id]);

  // Fetch theses belonging to this college
  useEffect(() => {
    if (!college) return;
    setThesisLoading(true);
    setThesisError(null);
    supabase
      .from('theses')
      .select('*')
      .eq('college_id', college.id)
      .then(({ data, error }) => {
        setThesisLoading(false);
        if (error) { setThesisError('Could not fetch theses'); return; }
        setTheses(data || []);
      });
  }, [college]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="text-lg text-gray-700">Loading college info...</span>
      </div>
    );
  }

  if (collegesError || !college) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="text-lg text-red-600">{collegesError || 'College not found'}</span>
      </div>
    );
  }

  // Map for icon, color etc
  const CollegeIcon = iconMap[college.name.toUpperCase()] || Code;
  const iconColor = colorMap[college.name.toUpperCase()] || 'text-gray-600';
  const gradientOverlay = bgMap[college.name.toUpperCase()] || 'from-gray-900/60 via-gray-700/40 to-gray-500/60';

  // Years filter (get from theses)
  const years = [
    ...new Set(
      theses
        .map(thesis => {
          const yearVal = Number(thesis.publish_date ? thesis.publish_date.slice(0, 4) : thesis.year ?? null);
          return isNaN(yearVal) ? null : yearVal;
        })
        .filter(Boolean)
    )
  ].sort((a, b) => b - a);

  const filteredTheses = theses.filter(thesis => {
    const matchesSearch =
      (thesis.title ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (thesis.author ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (thesis.keywords ?? []).some((keyword: string) => (keyword ?? '').toLowerCase().includes(searchQuery.toLowerCase()));
    const yearValue = thesis.publish_date ? String(thesis.publish_date).slice(0, 4) : String(thesis.year ?? '');
    const matchesYear =
      selectedYear === 'all' || (yearValue && yearValue === selectedYear);
    return matchesSearch && matchesYear;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header with College Background */}
          <div className="mb-12">
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="ghost" 
              className="mb-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Dashboard
            </Button>
            <div 
              className="text-center relative bg-cover bg-right bg-no-repeat rounded-3xl overflow-hidden"
              style={{ 
                // No backgroundImage for now, but you can add storage images here if you wish
                backgroundPosition: 'center right',
                minHeight: '300px'
              }}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${gradientOverlay}`}></div>
              <div className="relative z-10 py-16">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-8 shadow-xl border border-white/30`}>
                  <CollegeIcon className={`w-10 h-10 ${iconColor}`} />
                </div>
                <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">{college.name}</h1>
                <p className="text-xl text-white/95 max-w-3xl mx-auto leading-relaxed mb-4 drop-shadow-md">
                  {college.full_name || college.description}
                </p>
                <div className="flex items-center justify-center gap-8 text-white/90">
                  <div className="flex items-center gap-2">
                    <CollegeIcon className={`h-5 w-5`} />
                    <span className="font-medium">{theses.length} Theses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`h-5 w-5`} />
                    <span className="font-medium">Active Research</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What would you like to research in this college? Ask me anything about the theses..."
                      className="border-0 text-lg placeholder-gray-400 focus:ring-0 focus:border-0 h-auto py-2 px-0 bg-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 px-4 pb-4 pt-2 border-t border-gray-100">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="flex-1 h-12 bg-gray-50 border border-gray-300 rounded-xl px-4 focus:border-dlsl-green focus:outline-none text-base"
                  >
                    <option value="all">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                <span>Powered by semantic search</span>
                <Sparkles className="w-4 h-4 text-dlsl-green" />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredTheses.length} {filteredTheses.length === 1 ? 'Thesis' : 'Theses'} Found
              </h2>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Sorted by Latest</span>
              </div>
            </div>
          </div>

          {/* Thesis List */}
          <div className="space-y-6">
            {thesisLoading ? (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center text-gray-500">
                Loading theses...
              </div>
            ) : filteredTheses.map((thesis: any, idx: number) => (
              <Card 
                key={thesis.id ?? idx} 
                className="bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group shadow-sm"
                onClick={() => navigate(`/thesis/${thesis.id}`)}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold text-gray-900 mb-4`}>
                        {thesis.title}
                      </h3>
                      <div className="flex items-center gap-6 text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{thesis.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{thesis.year || (thesis.publish_date && thesis.publish_date.slice(0, 4))}</span>
                        </div>
                        <Badge variant="secondary" className="border-0">
                          {college.name}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">{thesis.view_count ?? 0}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{thesis.download_count ?? 0}</span>
                      </div>
                      <ExternalLink className={`h-5 w-5 text-gray-400`} />
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {thesis.abstract}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {(thesis.keywords ?? []).map((keyword: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No results section */}
          {!thesisLoading && filteredTheses.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="p-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No theses found</h3>
                <p className="text-gray-600 mb-8">Try adjusting your search terms or filters</p>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedYear('all');
                  }}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollegePage;
