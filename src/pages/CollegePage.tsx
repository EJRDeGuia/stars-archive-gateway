
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { colleges, mockTheses } from '@/data/mockData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Bookmark, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CollegePage = () => {
  const { collegeId } = useParams<{ collegeId: string }>();
  const [college, setCollege] = useState<any | null>(null);
  const [theses, setTheses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const foundCollege = colleges.find(c => c.id === collegeId);
    setCollege(foundCollege || null);

    const filteredTheses = mockTheses.filter(thesis => thesis.collegeId === collegeId);
    setTheses(filteredTheses);
  }, [collegeId]);

  const filteredTheses = theses.filter(thesis => 
    thesis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thesis.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thesis.authors.some((author: string) => 
      author.toLowerCase().includes(searchQuery.toLowerCase())
    ) ||
    thesis.tags.some((tag: string) => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (!college) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">College not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const getBgColorClass = () => {
    switch (college.color) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTextColorClass = () => {
    switch (college.color) {
      case 'red': return 'text-red-500';
      case 'yellow': return 'text-yellow-500';
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getBorderColorClass = () => {
    switch (college.color) {
      case 'red': return 'border-red-500';
      case 'yellow': return 'border-yellow-500';
      case 'blue': return 'border-blue-500';
      case 'green': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  const getTagBgClass = (tag: string) => {
    if (tag.toLowerCase().includes('ai') || tag.toLowerCase().includes('machine learning')) {
      return 'bg-green-100 text-green-800';
    } else if (tag.toLowerCase().includes('blockchain') || tag.toLowerCase().includes('security')) {
      return 'bg-blue-100 text-blue-800';
    } else if (tag.toLowerCase().includes('education') || tag.toLowerCase().includes('pedagogy')) {
      return 'bg-purple-100 text-purple-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Hero Banner */}
      <div className={`${getBgColorClass()} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold mb-2">{college.name}</h1>
          <h2 className="text-xl font-medium mb-4">{college.fullName}</h2>
          <p className="max-w-2xl">{college.description}</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Section */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Search {college.name} Theses
            </h2>
            <p className="text-gray-600 mb-4">Find research papers and theses from the {college.name}</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={`Search ${college.name} theses...`}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Theses ({filteredTheses.length})
              </h2>
              <Button variant="outline" size="sm" className="text-sm">
                <Filter className="mr-1 h-4 w-4" />
                Filters
              </Button>
            </div>

            {filteredTheses.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-gray-600">No theses found. Try adjusting your search.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTheses.map((thesis) => (
                  <Card 
                    key={thesis.id} 
                    className={`hover:shadow-md transition-shadow cursor-pointer border-l-4 ${getBorderColorClass()}`}
                    onClick={() => navigate(`/thesis/${thesis.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {thesis.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {thesis.authors.join(', ')} • {thesis.year}
                          </p>
                          <p className="text-gray-700 mb-4">{thesis.abstract}</p>
                          <div className="flex flex-wrap gap-2">
                            {thesis.tags.map((tag: string, index: number) => (
                              <Badge key={index} className={getTagBgClass(tag)}>
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={thesis.approved ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}
                        >
                          {thesis.approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`${getTextColorClass()}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/thesis/${thesis.id}`);
                          }}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Bookmark functionality would go here
                          }}
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CollegePage;
