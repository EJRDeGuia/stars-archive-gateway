
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockTheses, colleges } from '@/data/mockData';
import { ArrowLeft, Calendar, User, BookOpen, Tag, GraduationCap, FileText } from 'lucide-react';

const ThesisDetail = () => {
  const { thesisId } = useParams();
  const navigate = useNavigate();

  const thesis = mockTheses.find(t => t.id === thesisId);
  const college = thesis ? colleges.find(c => c.id === thesis.college) : null;

  if (!thesis || !college) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Thesis Not Found</h1>
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
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/college/${thesis.college}`)}
            className="mb-2 text-dlsl-green hover:text-dlsl-green-dark"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {college.name}
          </Button>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{college.fullName}</span> → <span className="font-medium">{thesis.department}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Title and Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold text-dlsl-green leading-tight mb-4">
                    {thesis.title}
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <User className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="font-medium">{thesis.author}</span>
                      {thesis.coAuthor && <span>, {thesis.coAuthor}</span>}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <GraduationCap className="w-5 h-5 mr-2 text-gray-400" />
                      <span>{college.fullName}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                      <span>{thesis.year} • {thesis.department}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <BookOpen className="w-5 h-5 mr-2 text-gray-400" />
                      <span>{thesis.pages} pages • Submitted: {new Date(thesis.dateSubmitted).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-6">
                  <Badge variant="outline" className="bg-dlsl-green text-white">
                    {thesis.year}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Abstract */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2" />
                Abstract
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {thesis.abstract}
              </p>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Tag className="w-5 h-5 mr-2" />
                Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {thesis.keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-dlsl-green/10 text-dlsl-green hover:bg-dlsl-green/20"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Thesis Advisor</h4>
                  <p className="text-gray-700">{thesis.advisor}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Department</h4>
                  <p className="text-gray-700">{thesis.department}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Date Submitted</h4>
                  <p className="text-gray-700">{new Date(thesis.dateSubmitted).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Page Count</h4>
                  <p className="text-gray-700">{thesis.pages} pages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thesis Viewer Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thesis Document</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Viewer</h3>
                <p className="text-gray-600 mb-4">
                  The full thesis document would be displayed here for viewing.
                </p>
                <p className="text-sm text-gray-500">
                  Note: Download functionality is intentionally disabled as per system requirements.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Related Theses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Theses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center py-8">
                Related theses recommendations will be displayed here based on keywords and subject matter.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ThesisDetail;
