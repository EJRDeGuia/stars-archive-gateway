
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
  Heart
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

  const years = [...new Set(collegeTheses.map(thesis => Number(thesis.year)))].sort((a, b) => b - a);
  
  const filteredTheses = collegeTheses.filter(thesis => {
    const matchesSearch = thesis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thesis.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thesis.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesYear = selectedYear === 'all' || thesis.year.toString() === selectedYear;
    return matchesSearch && matchesYear;
  });

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
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-8">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">{college.name}</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
                {college.fullName}
              </p>
              <div className="flex items-center justify-center gap-8 text-gray-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="font-medium">{collegeTheses.length} Theses</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="font-medium">Active Research</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-12">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search theses by title, author, or keywords..."
                        className="pl-12 h-12 bg-gray-50 border-gray-300 focus:border-primary rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full h-12 bg-gray-50 border border-gray-300 rounded-xl px-4 focus:border-primary focus:outline-none"
                    >
                      <option value="all">All Years</option>
                      {years.map(year => (
                        <option key={year} value={year.toString()}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
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
            {filteredTheses.map((thesis) => (
              <div 
                key={thesis.id} 
                className="bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group shadow-sm"
                onClick={() => navigate(`/thesis/${thesis.id}`)}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors leading-tight">
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
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
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
                      <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {thesis.abstract}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {thesis.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="border-gray-300 text-gray-600">
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
                </div>
              </div>
            ))}
          </div>

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
