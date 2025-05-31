import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockTheses, colleges } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Users, BookOpen, Building, Tag, Bookmark, Sparkles } from 'lucide-react';

const ThesisDetail = () => {
  const { thesisId } = useParams<{ thesisId: string }>();
  const navigate = useNavigate();
  const [thesis, setThesis] = useState<any | null>(null);
  const [college, setCollege] = useState<any | null>(null);

  useEffect(() => {
    const foundThesis = mockTheses.find(t => t.id === thesisId);
    setThesis(foundThesis || null);

    if (foundThesis) {
      const foundCollege = colleges.find(c => c.id === foundThesis.collegeId);
      setCollege(foundCollege || null);
    }
  }, [thesisId]);

  if (!thesis || !college) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Header />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-800 text-2xl font-medium">Thesis not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const getColorClasses = () => {
    switch (college.color) {
      case 'red': return { text: 'text-red-500', badge: 'bg-red-100 text-red-800', border: 'border-red-500' };
      case 'yellow': return { text: 'text-yellow-500', badge: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-500' };
      case 'blue': return { text: 'text-blue-500', badge: 'bg-blue-100 text-blue-800', border: 'border-blue-500' };
      case 'green': return { text: 'text-green-500', badge: 'bg-green-100 text-green-800', border: 'border-green-500' };
      default: return { text: 'text-gray-500', badge: 'bg-gray-100 text-gray-800', border: 'border-gray-500' };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />

      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Navigation and actions */}
          <div className="flex justify-between items-center mb-10">
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 shadow-sm text-lg"
              onClick={() => navigate(`/college/${college.id}`)}
            >
              <ArrowLeft className="mr-3 h-5 w-5" />
              Back to {college.name}
            </Button>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm text-lg">
                <Bookmark className="mr-3 h-5 w-5" />
                Save
              </Button>
              <Button className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark hover:from-dlsl-green-dark hover:to-dlsl-green text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg">
                Request Access
              </Button>
            </div>
          </div>

          {/* Thesis header */}
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-xl p-12 mb-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center bg-gradient-to-r from-dlsl-green/10 to-dlsl-green-dark/10 px-6 py-3 rounded-full text-sm font-medium border border-dlsl-green/20 shadow-sm mb-6">
                  <Sparkles className="w-4 h-4 mr-2 text-dlsl-green" />
                  <span className="text-gray-700">{college.name} Research</span>
                </div>
                <Badge className={`${colorClasses.badge} mb-6 text-lg px-4 py-2`}>
                  {college.name}
                </Badge>
                <h1 className="text-5xl font-bold text-gray-800 mb-8 leading-tight tracking-tight">{thesis.title}</h1>
                <div className="flex flex-wrap gap-8 text-gray-600 mb-8 text-lg">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 mr-3" />
                    <span className="font-medium">{thesis.authors.join(', ')}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-6 w-6 mr-3" />
                    <span className="font-medium">{thesis.year}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-6 w-6 mr-3" />
                    <span className="font-medium">{college.fullName}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {thesis.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-gray-200 text-gray-600 text-sm px-3 py-1 bg-gray-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={`${thesis.approved ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'} text-lg px-4 py-2`}
              >
                {thesis.approved ? 'Approved' : 'Pending'}
              </Badge>
            </div>
          </div>

          {/* Tabs for different content sections */}
          <Tabs defaultValue="abstract" className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-xl">
            <TabsList className="border-b border-gray-200 p-0 h-auto bg-transparent w-full justify-start">
              <TabsTrigger 
                value="abstract" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-4 data-[state=active]:border-dlsl-green rounded-none px-8 py-6 text-gray-700 data-[state=active]:text-gray-900 text-lg font-medium"
              >
                Abstract
              </TabsTrigger>
              <TabsTrigger 
                value="document" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-4 data-[state=active]:border-dlsl-green rounded-none px-8 py-6 text-gray-700 data-[state=active]:text-gray-900 text-lg font-medium"
              >
                View Document
              </TabsTrigger>
              <TabsTrigger 
                value="metadata" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-4 data-[state=active]:border-dlsl-green rounded-none px-8 py-6 text-gray-700 data-[state=active]:text-gray-900 text-lg font-medium"
              >
                Metadata
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="abstract" className="p-10">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Abstract</h2>
              <p className="text-gray-600 leading-relaxed mb-8 text-xl">
                {thesis.abstract}
              </p>
              <p className="text-gray-600 leading-relaxed text-xl">
                {thesis.abstract} {/* Duplicated for demonstration */}
              </p>
              
              <Separator className="my-10 bg-gray-200" />
              
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Keywords</h3>
                <div className="flex flex-wrap gap-3">
                  {thesis.tags.map((tag: string, index: number) => (
                    <Badge key={index} className="bg-gray-100 text-gray-700 text-lg px-4 py-2">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="document" className="p-10">
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-32 h-32 bg-gray-50 border border-gray-200 rounded-3xl flex items-center justify-center mb-8">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-3xl font-medium text-gray-800 mb-4">Document Preview</h3>
                <p className="text-gray-600 mb-10 text-xl text-center max-w-2xl leading-relaxed">The document preview is available for authorized users only.</p>
                <Button className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark hover:from-dlsl-green-dark hover:to-dlsl-green text-white px-10 py-6 text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Request Access
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="metadata" className="p-10">
              <h2 className="text-3xl font-bold mb-8 text-white">Thesis Metadata</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-lg font-medium text-white/70 mb-3">Title</h3>
                  <p className="text-white mb-8 text-xl">{thesis.title}</p>
                  
                  <h3 className="text-lg font-medium text-white/70 mb-3">Authors</h3>
                  <p className="text-white mb-8 text-xl">{thesis.authors.join(', ')}</p>
                  
                  <h3 className="text-lg font-medium text-white/70 mb-3">Year</h3>
                  <p className="text-white mb-8 text-xl">{thesis.year}</p>
                  
                  <h3 className="text-lg font-medium text-white/70 mb-3">College</h3>
                  <p className="text-white mb-8 text-xl">{college.fullName}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white/70 mb-3">Approval Status</h3>
                  <div className="mb-8">
                    <Badge 
                      variant="outline" 
                      className={`${thesis.approved ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'} text-lg px-4 py-2`}
                    >
                      {thesis.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-medium text-white/70 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {thesis.tags.map((tag: string, index: number) => (
                      <Badge key={index} className="bg-white/20 text-white text-lg px-4 py-2 backdrop-blur-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-medium text-white/70 mb-3">Document ID</h3>
                  <p className="text-white mb-8 text-xl font-mono">DLSL-{college.name}-{thesis.year}-{thesis.id.padStart(6, '0')}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ThesisDetail;
