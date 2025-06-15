import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  BookOpen, 
  Heart, 
  Download, 
  Calendar, 
  User,
  Trash2,
  ExternalLink,
  FolderOpen,
  Plus
} from 'lucide-react';

// Provide EMPTY ARRAYS for now. Should be replaced with Supabase-fetched values.
const theses: any[] = [];

const Library = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('bookmarks');
  
  // Mock saved items (in real app, this would come from user's saved data)
  const savedTheses = theses.slice(0, 5);
  const downloadedTheses = theses.slice(2, 7);

  const filteredItems = (items: typeof theses) => {
    return items.filter(thesis => 
      thesis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thesis.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleThesisClick = (thesisId: string) => {
    navigate(`/thesis/${thesisId}`);
  };

  const tabs = [
    { id: 'bookmarks', label: 'Bookmarks', count: savedTheses.length },
    { id: 'downloads', label: 'Downloads', count: downloadedTheses.length },
    { id: 'collections', label: 'Collections', count: 3 }
  ];

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
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">My Library</h1>
                <p className="text-xl text-gray-600">Your saved research papers and collections</p>
              </div>
              <Button className="bg-primary text-white">
                <Plus className="mr-2 h-4 w-4" />
                New Collection
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your library..."
                    className="pl-12 h-12 border-gray-300 focus:border-primary"
                  />
                </div>
                <Button variant="outline" className="h-12 border-gray-300">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <Badge variant="secondary" className="bg-gray-200 text-gray-600 border-0">
                    {tab.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Bookmarked Papers ({filteredItems(savedTheses).length})
                </h2>
              </div>
              
              {filteredItems(savedTheses).map((thesis) => (
                <Card 
                  key={thesis.id} 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-gray-200"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1" onClick={() => handleThesisClick(thesis.id)}>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary transition-colors">
                          {thesis.title}
                        </h3>
                        <div className="flex items-center gap-6 text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{thesis.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{thesis.year}</span>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                            {thesis.college}
                          </Badge>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {thesis.abstract.substring(0, 200)}...
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {thesis.keywords.slice(0, 3).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="border-gray-300 text-gray-600">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-6">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleThesisClick(thesis.id)}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Downloaded Papers ({filteredItems(downloadedTheses).length})
                </h2>
              </div>
              
              {filteredItems(downloadedTheses).map((thesis) => (
                <Card 
                  key={thesis.id} 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-gray-200"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1" onClick={() => handleThesisClick(thesis.id)}>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary transition-colors">
                          {thesis.title}
                        </h3>
                        <div className="flex items-center gap-6 text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{thesis.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{thesis.year}</span>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                            Downloaded
                          </Badge>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {thesis.abstract.substring(0, 200)}...
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-6">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'collections' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Collections (3)</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['AI Research', 'Educational Technology', 'Data Science'].map((collection, index) => (
                  <Card key={collection} className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-gray-200">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FolderOpen className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{collection}</h3>
                      <p className="text-gray-600 mb-4">{3 + index} papers</p>
                      <Button variant="outline" className="w-full border-gray-300">
                        View Collection
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Library;
