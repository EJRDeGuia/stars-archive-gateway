import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { colleges, mockTheses } from '@/data/mockData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Bookmark, Filter, Sparkles } from 'lucide-react';
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
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md" 
            style={{
              backgroundImage: `url(/lovable-uploads/83b8c064-b1bc-4c93-b353-78a1467e8d8d.png)`,
              filter: 'brightness(1.1) contrast(1.1)',
              transform: 'scale(1.1)'
            }}
          ></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
          <div className="absolute inset-0 opacity-15" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,100,0,0.3) 0.5px, transparent 0)`,
            backgroundSize: '12px 12px',
            backgroundPosition: '6px 6px'
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-green-700/20 to-emerald-800/25"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
        </div>
        <div className="relative z-30">
          <Header />
          <div className="flex-1 flex items-center justify-center min-h-[60vh]">
            <p className="text-white text-2xl font-medium">College not found</p>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  const getCollegeBackgroundImage = () => {
    switch (college.name) {
      case 'CITE':
        return '/lovable-uploads/65650cd1-6127-4c49-8cc6-74afa87f94b4.png';
      case 'CBEAM':
        return '/lovable-uploads/17b2bb63-8a6a-4ce5-af38-77d4c6f73cab.png';
      case 'CEAS':
        return '/lovable-uploads/ca2b4dc8-6abf-4400-baea-d3dbb3f5026a.png';
      case 'CON':
        return '/lovable-uploads/ab6b2d0e-87a1-4969-89c9-994de79d8a8a.png';
      case 'CIHTM':
        return '/lovable-uploads/97a911d3-0111-4c1a-9d25-f6a737f5ffec.png';
      default:
        return '';
    }
  };

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md" 
          style={{
            backgroundImage: `url(/lovable-uploads/83b8c064-b1bc-4c93-b353-78a1467e8d8d.png)`,
            filter: 'brightness(1.1) contrast(1.1)',
            transform: 'scale(1.1)'
          }}
        ></div>
        
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,100,0,0.3) 0.5px, transparent 0)`,
          backgroundSize: '12px 12px',
          backgroundPosition: '6px 6px'
        }}></div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-green-700/20 to-emerald-800/25"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-30">
        <Header />
        
        {/* Hero Banner with Background Image */}
        <div 
          className="relative text-white"
          style={{
            backgroundImage: `url(${getCollegeBackgroundImage()})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 ${getBgColorClass()} bg-opacity-80`}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="inline-flex items-center backdrop-blur-xl px-6 py-3 rounded-full text-sm font-medium border border-white/30 shadow-2xl bg-transparent mb-8">
              <Sparkles className="w-4 h-4 mr-2 text-white" />
              <span className="text-white">Academic Research Collection</span>
            </div>
            <h1 className="text-6xl font-bold mb-4 drop-shadow-2xl">{college.name}</h1>
            <h2 className="text-2xl font-medium mb-6 text-white/90 drop-shadow-lg">{college.fullName}</h2>
            <p className="max-w-3xl text-xl leading-relaxed text-white/95 drop-shadow-lg">{college.description}</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Search Section */}
            <div className="mb-12 glass-effect p-10 rounded-3xl sleek-shadow-xl border border-white/20">
              <h2 className="text-4xl font-bold mb-6 flex items-center text-white">
                <Search className="mr-4 h-8 w-8" />
                Search {college.name} Theses
              </h2>
              <p className="text-white/80 mb-8 text-xl leading-relaxed">Find research papers and theses from the {college.name}</p>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/60 h-6 w-6" />
                <Input
                  type="text"
                  placeholder={`Search ${college.name} theses...`}
                  className="pl-16 h-16 text-xl bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 transition-all duration-300 rounded-2xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold flex items-center text-white">
                  <BookOpen className="mr-4 h-8 w-8" />
                  Theses ({filteredTheses.length})
                </h2>
                <Button variant="outline" size="sm" className="text-lg border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </Button>
              </div>

              {filteredTheses.length === 0 ? (
                <div className="glass-effect p-12 rounded-3xl sleek-shadow-xl text-center border border-white/20">
                  <p className="text-white text-xl">No theses found. Try adjusting your search.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredTheses.map((thesis) => (
                    <Card 
                      key={thesis.id} 
                      className={`hover:sleek-shadow-2xl transition-all duration-300 cursor-pointer border-l-4 ${getBorderColorClass()} glass-effect border-white/20 rounded-2xl sleek-shadow-xl transform hover:scale-105`}
                      onClick={() => navigate(`/thesis/${thesis.id}`)}
                    >
                      <CardContent className="p-8">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-4 leading-relaxed">
                              {thesis.title}
                            </h3>
                            <p className="text-lg text-white/80 mb-4 font-medium">
                              {thesis.authors.join(', ')} • {thesis.year}
                            </p>
                            <p className="text-white/90 mb-6 text-lg leading-relaxed">{thesis.abstract}</p>
                            <div className="flex flex-wrap gap-3">
                              {thesis.tags.map((tag: string, index: number) => (
                                <Badge key={index} className={`${getTagBgClass(tag)} text-sm px-3 py-1`}>
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${thesis.approved ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'} text-sm px-3 py-1`}
                          >
                            {thesis.approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`${getTextColorClass()} border-white/30 text-white hover:bg-white/10 backdrop-blur-sm`}
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
                            className="text-white hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Bookmark functionality would go here
                            }}
                          >
                            <Bookmark className="h-5 w-5" />
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
    </div>
  );
};

export default CollegePage;
