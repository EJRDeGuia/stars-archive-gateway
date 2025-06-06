
import { useParams, useNavigate } from 'react-router-dom';
import { colleges, theses } from '@/data/mockData';
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
  Download,
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
import { useState } from 'react';

const CollegePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  const college = colleges.find(c => c.id === id);
  const collegeTheses = theses.filter(thesis => thesis.college.toLowerCase() === college?.name.toLowerCase());

  if (!college) {
    return <div>College not found</div>;
  }

  // Map college names to their respective uploaded images and icons
  const getCollegeBackgroundImage = (collegeName: string) => {
    switch (collegeName.toLowerCase()) {
      case 'cite':
        return '/lovable-uploads/27c09e44-0b10-429b-bc06-05f3a5124d36.png';
      case 'cbeam':
        return '/lovable-uploads/1b0681ef-72c8-4649-9b12-47e3d1fc6239.png';
      case 'ceas':
        return '/lovable-uploads/35ad8e3f-40aa-4c24-bc92-5393417d2379.png';
      case 'con':
        return '/lovable-uploads/ba5d37d3-1cc2-4915-93bc-1f698e36177b.png';
      case 'cihtm':
        return '/lovable-uploads/442339ca-fa3b-43f5-bb23-46791d131f12.png';
      default:
        return '';
    }
  };

  const getCollegeIcon = (collegeName: string) => {
    switch (collegeName.toLowerCase()) {
      case 'cite':
        return Code;
      case 'cbeam':
        return Calculator;
      case 'ceas':
        return Microscope;
      case 'con':
        return HeartPulse;
      case 'cihtm':
        return UtensilsCrossed;
      default:
        return Code;
    }
  };

  const getCollegeGradient = (collegeName: string) => {
    switch (collegeName.toLowerCase()) {
      case 'cite':
        return 'from-red-900/60 via-red-700/40 to-red-500/60';
      case 'cbeam':
        return 'from-yellow-900/60 via-yellow-700/40 to-yellow-500/60';
      case 'ceas':
        return 'from-blue-900/60 via-blue-700/40 to-blue-500/60';
      case 'con':
        return 'from-gray-900/60 via-gray-700/40 to-gray-500/60';
      case 'cihtm':
        return 'from-green-900/60 via-green-700/40 to-green-500/60';
      default:
        return 'from-gray-900/60 via-gray-700/40 to-gray-500/60';
    }
  };

  const years = [...new Set(collegeTheses.map(thesis => Number(thesis.year)))].sort((a, b) => b - a);
  
  const filteredTheses = collegeTheses.filter(thesis => {
    const matchesSearch = thesis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thesis.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thesis.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesYear = selectedYear === 'all' || thesis.year.toString() === selectedYear;
    return matchesSearch && matchesYear;
  });

  const backgroundImage = getCollegeBackgroundImage(college.name);
  const CollegeIcon = getCollegeIcon(college.name);
  const gradientOverlay = getCollegeGradient(college.name);

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
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                minHeight: '300px'
              }}
            >
              {/* Gradient overlay for better text readability and color matching */}
              <div className={`absolute inset-0 bg-gradient-to-r ${gradientOverlay}`}></div>
              
              <div className="relative z-10 py-16">
                <div className={`inline-flex items-center justify-center w-20 h-20 ${college.bgColorLight} rounded-2xl mb-8 shadow-xl`}>
                  <CollegeIcon className={`w-10 h-10 ${college.textColor}`} />
                </div>
                <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">{college.name}</h1>
                <p className="text-xl text-white/95 max-w-3xl mx-auto leading-relaxed mb-4 drop-shadow-md">
                  {college.fullName}
                </p>
                <div className="flex items-center justify-center gap-8 text-white/90">
                  <div className="flex items-center gap-2">
                    <CollegeIcon className={`h-5 w-5`} />
                    <span className="font-medium">{collegeTheses.length} Theses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`h-5 w-5`} />
                    <span className="font-medium">Active Research</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter - Dashboard Style */}
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

          {/* Thesis List - No individual thesis images */}
          <div className="space-y-6">
            {filteredTheses.map((thesis) => (
              <Card 
                key={thesis.id} 
                className="bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group shadow-sm"
                onClick={() => navigate(`/thesis/${thesis.id}`)}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold text-gray-900 mb-4 group-hover:${college.textColor} transition-colors leading-tight`}>
                        {thesis.title}
                      </h3>
                      <div className="flex items-center gap-6 text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{thesis.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{thesis.year}</span>
                        </div>
                        <Badge variant="secondary" className={`${college.bgColorLight} ${college.textColor} border-0`}>
                          {thesis.college}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">234</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">12</span>
                      </div>
                      <ExternalLink className={`h-5 w-5 text-gray-400 group-hover:${college.textColor} transition-colors`} />
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {thesis.abstract}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {thesis.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className={`${college.borderColor} ${college.textColor}`}>
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Download thesis:', thesis.id);
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No results section */}
          {filteredTheses.length === 0 && (
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
