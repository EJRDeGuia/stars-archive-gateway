
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, HelpCircle, Mail, Phone, MapPin, Clock, Loader2, BookOpen, FileText, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useResourcesContent } from '@/hooks/useResourcesContent';

const Resources = () => {
  const navigate = useNavigate();
  const { data: resourcesContent, isLoading } = useResourcesContent();

  // Group content by category
  const groupedContent = resourcesContent?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof resourcesContent>) || {};

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'access': return <Users className="h-6 w-6" />;
      case 'search': return <Search className="h-6 w-6" />;
      case 'support': return <HelpCircle className="h-6 w-6" />;
      default: return <BookOpen className="h-6 w-6" />;
    }
  };

  const faqs = [
    {
      question: "How do I access thesis documents?",
      answer: "You need to sign in with your De La Salle Lipa credentials to access full documents. Guest users can browse titles and abstracts. To access or download documents, please contact the LRC directly."
    },
    {
      question: "Can I download thesis documents?",
      answer: "To access or download this document, please contact the LRC directly. All documents are protected and require special permission for downloads."
    },
    {
      question: "How often is the database updated?",
      answer: "The database is updated regularly as new theses are submitted and approved by the academic departments."
    },
    {
      question: "What file formats are supported?",
      answer: "STARS primarily supports PDF documents, but may also include supplementary materials in various formats."
    },
    {
      question: "How do I report technical issues?",
      answer: "You can contact our support team through the contact information provided below or use the feedback form in the system."
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-dlsl-green" />
          <span className="text-gray-600">Loading resources...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
              className="mb-8 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
            </Button>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-dlsl-green/10 rounded-2xl mb-8">
                <HelpCircle className="w-10 h-10 text-dlsl-green" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Resources & Help</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Everything you need to know about using STARS effectively
              </p>
            </div>
          </div>

          {/* Dynamic User Guides */}
          {Object.keys(groupedContent).length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">User Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(groupedContent).map(([category, items]) => (
                  <div key={category} className="space-y-4">
                    {items.map((item) => (
                      <Card key={item.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="w-12 h-12 bg-dlsl-green/10 rounded-xl flex items-center justify-center mb-4 text-dlsl-green">
                            {getIconForCategory(category)}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Learning Resource Center</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-dlsl-green mr-3" />
                      <span className="text-gray-600">De La Salle Lipa, Mataas na Lupa, Lipa City, Batangas</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-dlsl-green mr-3" />
                      <span className="text-gray-600">(043) 756-5555</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-dlsl-green mr-3" />
                      <span className="text-gray-600">library@dlsl.edu.ph</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Support Hours</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-dlsl-green mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Monday - Friday</div>
                        <div className="text-gray-600">8:00 AM - 5:00 PM</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-dlsl-green mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Saturday</div>
                        <div className="text-gray-600">8:00 AM - 12:00 PM</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-4">
                      For urgent technical issues, please email us and we'll respond within 24 hours.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <Card className="bg-dlsl-green text-white">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                  Join the STARS community and start exploring our comprehensive thesis collection.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    onClick={() => navigate('/login')}
                    className="bg-white text-dlsl-green hover:bg-gray-100 px-8 py-4 rounded-xl"
                  >
                    Sign In to STARS
                  </Button>
                  <Button 
                    onClick={() => navigate('/')}
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl"
                  >
                    Browse Public Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;
