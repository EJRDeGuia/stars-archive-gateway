
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { colleges, mockTheses } from '@/data/mockData';
import { Search, ArrowLeft, Calendar, User, BookOpen, Tag } from 'lucide-react';

const CollegePage = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const college = colleges.find(c => c.id === collegeId);
  const collegeTheses = mockTheses.filter(thesis => thesis.college === collegeId);

  const filteredTheses = useMemo(() => {
    if (!searchQuery) return collegeTheses;
    
    const query = searchQuery.toLowerCase();
    return collegeTheses.filter(thesis =>
      thesis.title.toLowerCase().includes(query) ||
      thesis.author.toLowerCase().includes(query) ||
      thesis.abstract.toLowerCase().includes(query) ||
      thesis.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
      thesis.department.toLowerCase().includes(query)
    );
  }, [collegeTheses, searchQuery]);

  if (!college) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">College Not Found</h1>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-dlsl-green hover:text-dlsl-green-dark"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="bg-white rounded-lg border-l-4 border-l-dlsl-green shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-dlsl-green">{college.name}</h1>
              <Badge variant="secondary" className="bg-dlsl-gold text-dlsl-green-dark">
                {collegeTheses.length} theses available
              </Badge>
            </div>
            <h2 className="text-xl text-gray-700 mb-2">{college.fullName}</h2>
            <p className="text-gray-600">{college.description}</p>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search theses by title, author, keywords, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg border-gray-300 focus:border-dlsl-green focus:ring-dlsl-green"
              />
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-600">
                Found {filteredTheses.length} thesis{filteredTheses.length !== 1 ? 'es' : ''} matching "{searchQuery}"
              </p>
            )}
          </div>
        </div>

        {/* Theses Grid */}
        {filteredTheses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No theses found' : 'No theses available'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Try adjusting your search terms or browse all theses.'
                : 'Theses for this college will appear here when available.'
              }
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTheses.map((thesis) => (
              <Card 
                key={thesis.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => navigate(`/thesis/${thesis.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-dlsl-green leading-tight mb-2">
                        {thesis.title}
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-1" />
                          {thesis.author}
                          {thesis.coAuthor && `, ${thesis.coAuthor}`}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {thesis.year} • {thesis.department}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {thesis.pages} pages
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {thesis.abstract}
                  </p>
                  
                  {/* Keywords */}
                  <div className="flex items-start gap-2 mb-4">
                    <Tag className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {thesis.keywords.slice(0, 3).map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          {keyword}
                        </Badge>
                      ))}
                      {thesis.keywords.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          +{thesis.keywords.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Advisor: {thesis.advisor}
                    </p>
                    <Button 
                      size="sm"
                      className="bg-dlsl-green hover:bg-dlsl-green-dark text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/thesis/${thesis.id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CollegePage;
