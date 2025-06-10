import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchInterface from '@/components/SearchInterface';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, BookOpen, TrendingUp, Clock, Star } from 'lucide-react';
import { theses } from '@/data/mockData';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Explore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredTheses, setFilteredTheses] = useState(theses);
  const [isSearching, setIsSearching] = useState(false);

  const filters = [
    { id: 'all', label: 'All Theses', count: theses.length },
    { id: 'recent', label: 'Recent', count: 24 },
    { id: 'popular', label: 'Most Popular', count: 18 },
    { id: 'trending', label: 'Trending', count: 12 }
  ];

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // The SearchInterface component handles the actual search
    // This is just for logging purposes
    setIsSearching(true);
  };

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
    
    let filtered = [...theses];
    switch (filterId) {
      case 'recent':
        filtered = theses.filter(thesis => thesis.year >= 2023);
        break;
      case 'popular':
        filtered = theses.slice(0, 18); // Mock popular theses
        break;
      case 'trending':
        filtered = theses.slice(0, 12); // Mock trending theses
        break;
      default:
        filtered = theses;
    }
    setFilteredTheses(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Research</h1>
            <p className="text-xl text-gray-600">
              Discover academic research and theses from De La Salle Lipa University
            </p>
          </div>

          {/* Search Interface */}
          <div className="mb-12">
            <SearchInterface
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              isLoading={isSearching}
            />
          </div>

          {/* Results */}
          <div className="mb-12">
            <div className="space-y-6">
              {filteredTheses.map((thesis) => (
                <Card 
                  key={thesis.id}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-gray-200"
                  onClick={() => navigate(`/thesis/${thesis.id}`)}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-dlsl-green/10 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-dlsl-green" />
                          </div>
                          <Badge variant="secondary" className="bg-dlsl-green/10 text-dlsl-green border-0">
                            {thesis.college}
                          </Badge>
                          <Badge variant="outline" className="border-gray-300 text-gray-600">
                            {thesis.year}
                          </Badge>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-dlsl-green transition-colors">
                          {thesis.title}
                        </h3>
                        
                        <p className="text-lg text-gray-600 font-medium mb-4">{thesis.author}</p>
                        
                        <p className="text-gray-600 leading-relaxed mb-6">
                          {thesis.abstract.substring(0, 300)}...
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {thesis.keywords.slice(0, 4).map((keyword, index) => (
                              <Badge key={index} variant="outline" className="border-gray-300 text-gray-600">
                                {keyword}
                              </Badge>
                            ))}
                            {thesis.keywords.length > 4 && (
                              <Badge variant="outline" className="border-gray-300 text-gray-600">
                                +{thesis.keywords.length - 4} more
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-6 text-gray-500">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>1.2k views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              <span>4.5</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>15 min read</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
