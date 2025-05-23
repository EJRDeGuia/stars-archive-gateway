
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockTheses, colleges } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Users, BookOpen, Building, Tag, Bookmark } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Thesis not found</p>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation and actions */}
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900"
              onClick={() => navigate(`/college/${college.id}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {college.name}
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button className={`bg-dlsl-green hover:bg-dlsl-green-dark text-white`}>
                Request Access
              </Button>
            </div>
          </div>

          {/* Thesis header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <Badge className={`${colorClasses.badge} mb-4`}>
                  {college.name}
                </Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{thesis.title}</h1>
                <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{thesis.authors.join(', ')}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{thesis.year}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    <span>{college.fullName}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {thesis.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-gray-200">
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
          </div>

          {/* Tabs for different content sections */}
          <Tabs defaultValue="abstract" className="bg-white rounded-lg shadow-sm">
            <TabsList className="border-b p-0 h-auto">
              <TabsTrigger 
                value="abstract" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-dlsl-green rounded-none px-6 py-3"
              >
                Abstract
              </TabsTrigger>
              <TabsTrigger 
                value="document" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-dlsl-green rounded-none px-6 py-3"
              >
                View Document
              </TabsTrigger>
              <TabsTrigger 
                value="metadata" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-dlsl-green rounded-none px-6 py-3"
              >
                Metadata
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="abstract" className="p-6">
              <h2 className="text-xl font-bold mb-4">Abstract</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {thesis.abstract}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {thesis.abstract} {/* Duplicated for demonstration */}
              </p>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {thesis.tags.map((tag: string, index: number) => (
                    <Badge key={index} className="bg-gray-100 text-gray-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="document" className="p-6">
              <div className="flex flex-col items-center justify-center py-10">
                <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Document Preview</h3>
                <p className="text-gray-600 mb-6">The document preview is available for authorized users only.</p>
                <Button className="bg-dlsl-green hover:bg-dlsl-green-dark text-white">
                  Request Access
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="metadata" className="p-6">
              <h2 className="text-xl font-bold mb-4">Thesis Metadata</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
                  <p className="text-gray-900 mb-4">{thesis.title}</p>
                  
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Authors</h3>
                  <p className="text-gray-900 mb-4">{thesis.authors.join(', ')}</p>
                  
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Year</h3>
                  <p className="text-gray-900 mb-4">{thesis.year}</p>
                  
                  <h3 className="text-sm font-medium text-gray-500 mb-1">College</h3>
                  <p className="text-gray-900 mb-4">{college.fullName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Approval Status</h3>
                  <p className="text-gray-900 mb-4">
                    <Badge 
                      variant="outline" 
                      className={thesis.approved ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}
                    >
                      {thesis.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </p>
                  
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {thesis.tags.map((tag: string, index: number) => (
                      <Badge key={index} className="bg-gray-100 text-gray-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Document ID</h3>
                  <p className="text-gray-900 mb-4">DLSL-{college.name}-{thesis.year}-{thesis.id.padStart(6, '0')}</p>
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
