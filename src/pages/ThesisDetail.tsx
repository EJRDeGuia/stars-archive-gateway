
import { useParams, useNavigate } from 'react-router-dom';
import { theses } from '@/data/mockData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Bookmark, 
  User, 
  Calendar, 
  FileText,
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  Star
} from 'lucide-react';

const ThesisDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const thesis = theses.find(t => t.id === id);

  if (!thesis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-900 mb-4">Thesis not found</h1>
          <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <Button 
              onClick={() => navigate(-1)} 
              variant="ghost" 
              className="mb-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and Metadata */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-8">
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                      {thesis.title}
                    </h1>
                    
                    <div className="flex items-center gap-6 text-gray-600 mb-6">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <span className="font-medium text-lg">{thesis.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span className="text-lg">{thesis.year}</span>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-sm">
                        {thesis.college}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-8 text-gray-500">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        <span>1,234 views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        <span>45 likes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        <span>12 citations</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {thesis.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="border-gray-300 text-gray-600">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Abstract */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Abstract</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {thesis.abstract}
                  </p>
                </div>
              </div>

              {/* Research Methodology */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Research Methodology</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    This research employed a mixed-methods approach, combining quantitative analysis through surveys and qualitative insights from in-depth interviews. The study utilized a sample size of 200 participants selected through stratified random sampling to ensure representative results across different demographic groups.
                  </p>
                </div>
              </div>

              {/* Key Findings */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Findings</h2>
                  <ul className="space-y-4 text-gray-700 text-lg">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <span>The implementation of AI-driven educational technologies showed a 35% improvement in student engagement rates.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <span>Students demonstrated increased retention rates when using adaptive learning platforms compared to traditional methods.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <span>The cost-effectiveness of implementing these technologies showed positive ROI within 18 months.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Actions</h3>
                  <div className="space-y-4">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3">
                      <Download className="mr-2 h-5 w-5" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-3">
                      <Bookmark className="mr-2 h-5 w-5" />
                      Save to Library
                    </Button>
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-3">
                      <Share2 className="mr-2 h-5 w-5" />
                      Share Thesis
                    </Button>
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-3">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Cite This Work
                    </Button>
                  </div>
                </div>
              </div>

              {/* Document Info */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Document Information</h3>
                  <div className="space-y-4 text-gray-600">
                    <div className="flex justify-between">
                      <span>Pages:</span>
                      <span className="font-medium text-gray-900">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File Size:</span>
                      <span className="font-medium text-gray-900">2.4 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="font-medium text-gray-900">PDF</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Language:</span>
                      <span className="font-medium text-gray-900">English</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Added:</span>
                      <span className="font-medium text-gray-900">Mar 15, 2024</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Community Rating</h3>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-6 h-6 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">4.2</div>
                    <div className="text-gray-600">Based on 28 reviews</div>
                  </div>
                </div>
              </div>

              {/* Related Theses */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Related Theses</h3>
                  <div className="space-y-4">
                    {theses.filter(t => t.id !== thesis.id && t.college === thesis.college).slice(0, 3).map((relatedThesis) => (
                      <div 
                        key={relatedThesis.id}
                        className="cursor-pointer group"
                        onClick={() => navigate(`/thesis/${relatedThesis.id}`)}
                      >
                        <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors leading-tight mb-2">
                          {relatedThesis.title.substring(0, 60)}...
                        </h4>
                        <p className="text-sm text-gray-600">{relatedThesis.author} • {relatedThesis.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ThesisDetail;
