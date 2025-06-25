
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, HelpCircle, Mail, Phone, MapPin, Clock, Loader2, BookOpen, FileText, Search, Users, Download, MessageCircle, Globe, Shield, ScrollText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useResourcesContent } from '@/hooks/useResourcesContent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Resources = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: resourcesContent, isLoading } = useResourcesContent();

  // Handle navigation to specific sections based on pathname
  useEffect(() => {
    const sectionMap: Record<string, string> = {
      '/user-guide': 'user-guide',
      '/help': 'help-center',
      '/research-format': 'research-format',
      '/faq': 'faq',
      '/privacy-policy': 'privacy-policy',
      '/terms-of-service': 'terms-of-service'
    };

    const targetSection = sectionMap[location.pathname];
    if (targetSection) {
      setTimeout(() => {
        const element = document.getElementById(targetSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.pathname]);

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
      answer: "To access full thesis documents, you need to be logged in with your DLSL credentials and connected to the campus network. Preview pages are available to all users. Contact the LRC if you need assistance."
    },
    {
      question: "Can I download thesis documents?",
      answer: "Full document access is restricted to protect intellectual property. You can view documents online and contact the LRC directly for specific access requests."
    },
    {
      question: "How do I search for specific theses?",
      answer: "Use the search bar with keywords related to your topic. You can search by title, author, keywords, or college. Use quotation marks for exact phrases and apply filters to narrow your results."
    },
    {
      question: "What file formats are supported?",
      answer: "STARS primarily supports PDF documents. All thesis documents are converted to PDF format for consistent viewing and security."
    },
    {
      question: "How do I create collections?",
      answer: "Log in to your account, find theses you want to save, and use the 'Save to Library' function. You can then organize these into custom collections from your dashboard."
    },
    {
      question: "Who can upload theses to STARS?",
      answer: "Only authorized archivists and LRC staff can upload thesis documents to maintain quality and authenticity of the archive."
    },
    {
      question: "How do I cite a thesis from STARS?",
      answer: "Each thesis page includes citation information. Click the 'Cite This Work' button to get properly formatted citations in APA style."
    },
    {
      question: "Is there a mobile app for STARS?",
      answer: "STARS is a web-based platform optimized for mobile browsers. Simply access the website from your mobile device for the best experience."
    },
    {
      question: "How often is the database updated?",
      answer: "The STARS database is updated regularly as new theses are submitted and processed by the LRC. New content is typically added weekly."
    },
    {
      question: "Can external researchers access STARS?",
      answer: "Access is primarily for DLSL community members. External researchers should contact the LRC directly to inquire about special access arrangements."
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

          {/* Navigation Menu */}
          <div className="mb-16">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Navigation</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Button variant="outline" onClick={() => document.getElementById('user-guide')?.scrollIntoView({ behavior: 'smooth' })}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    User Guide
                  </Button>
                  <Button variant="outline" onClick={() => document.getElementById('help-center')?.scrollIntoView({ behavior: 'smooth' })}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help Center
                  </Button>
                  <Button variant="outline" onClick={() => document.getElementById('research-format')?.scrollIntoView({ behavior: 'smooth' })}>
                    <FileText className="mr-2 h-4 w-4" />
                    Research Format
                  </Button>
                  <Button variant="outline" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    FAQ
                  </Button>
                  <Button variant="outline" onClick={() => document.getElementById('privacy-policy')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Shield className="mr-2 h-4 w-4" />
                    Privacy Policy
                  </Button>
                  <Button variant="outline" onClick={() => document.getElementById('terms-of-service')?.scrollIntoView({ behavior: 'smooth' })}>
                    <ScrollText className="mr-2 h-4 w-4" />
                    Terms of Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dynamic User Guides */}
          {Object.keys(groupedContent).length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Getting Started</h2>
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

          {/* User Guide Section */}
          <section id="user-guide" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">User Guide</h2>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="mr-2 h-6 w-6" />
                    Searching for Theses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Use the search bar to find theses by title, author, keywords, or college. You can also use advanced filters to narrow down your results.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Enter keywords related to your research topic</li>
                    <li>Use quotation marks for exact phrases</li>
                    <li>Filter by college, year, or subject area</li>
                    <li>Browse by collections for curated thesis groups</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-6 w-6" />
                    Accessing Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    To access full thesis documents, you need to be connected to the DLSL network and have appropriate permissions.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Log in with your DLSL credentials</li>
                    <li>Ensure you're connected to the campus network</li>
                    <li>Contact the LRC for access assistance</li>
                    <li>Preview pages are available for all users</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-6 w-6" />
                    Creating Collections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Organize your research by creating personal collections of theses.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Save interesting theses to your library</li>
                    <li>Create themed collections</li>
                    <li>Share collections with colleagues</li>
                    <li>Export citations for your research</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Help Center Section */}
          <section id="help-center" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Help Center</h2>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="mr-2 h-6 w-6" />
                    Common Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Cannot access PDF documents</h3>
                      <p className="text-gray-700">Make sure you're logged in and connected to the DLSL network. Contact the LRC if you continue having issues.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Search not returning results</h3>
                      <p className="text-gray-700">Try using different keywords, check your spelling, or broaden your search terms.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Login problems</h3>
                      <p className="text-gray-700">Ensure you're using your correct DLSL credentials. Contact IT support if you've forgotten your password.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Research Format Section */}
          <section id="research-format" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Research Format Guidelines</h2>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-6 w-6" />
                    General Formatting Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Paper size: 8.5" x 11" (Letter)</li>
                    <li>Font: Times New Roman, 12pt</li>
                    <li>Line spacing: Double-spaced</li>
                    <li>Margins: 1.5" left, 1" right, top, and bottom</li>
                    <li>Page numbers: Bottom center, starting from the introduction</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Required Sections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Preliminary Pages</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                        <li>Title Page</li>
                        <li>Approval Sheet</li>
                        <li>Acknowledgments</li>
                        <li>Abstract</li>
                        <li>Table of Contents</li>
                        <li>List of Tables/Figures (if applicable)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Main Body</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                        <li>Chapter 1: Introduction</li>
                        <li>Chapter 2: Review of Related Literature</li>
                        <li>Chapter 3: Methodology</li>
                        <li>Chapter 4: Results and Discussion</li>
                        <li>Chapter 5: Summary, Conclusions, and Recommendations</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Reference Materials</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                        <li>References (APA 7th Edition)</li>
                        <li>Appendices (if applicable)</li>
                        <li>Curriculum Vitae</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Citation Style</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    All theses must follow the APA (American Psychological Association) 7th Edition style for citations and references.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Need help with APA formatting?</strong> Contact the LRC for assistance or attend our citation workshops.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-6 w-6" />
                  Common Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Still need help?</h3>
              <p className="text-blue-800 mb-4">
                If you can't find the answer you're looking for, please contact the Learning Resource Center.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" asChild>
                  <a href="mailto:lrc@dlsl.edu.ph">Email Support</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="tel:+6343123456">Call Support</a>
                </Button>
              </div>
            </div>
          </section>

          {/* Privacy Policy Section */}
          <section id="privacy-policy" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h2>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h3>
                    <p className="text-gray-700 mb-4">
                      STARS collects information necessary to provide educational services and maintain academic records. This includes:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>User authentication data (DLSL credentials)</li>
                      <li>Research activity and search history</li>
                      <li>Collection and library preferences</li>
                      <li>System usage analytics</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Information</h3>
                    <p className="text-gray-700 mb-4">
                      Your information is used to:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>Provide access to thesis documents and research materials</li>
                      <li>Maintain your personal collections and preferences</li>
                      <li>Improve our services and user experience</li>
                      <li>Generate anonymized usage statistics</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Security</h3>
                    <p className="text-gray-700">
                      We implement appropriate security measures to protect your personal information against unauthorized access, 
                      alteration, disclosure, or destruction. All data is stored securely and access is limited to authorized personnel only.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
                    <p className="text-gray-700">
                      If you have questions about this privacy policy, please contact the Learning Resource Center at 
                      <a href="mailto:lrc@dlsl.edu.ph" className="text-dlsl-green hover:underline ml-1">lrc@dlsl.edu.ph</a>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Terms of Service Section */}
          <section id="terms-of-service" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h2>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Acceptance of Terms</h3>
                    <p className="text-gray-700">
                      By accessing and using STARS (Smart Thesis Archival and Retrieval System), you agree to be bound by these 
                      Terms of Service and all applicable laws and regulations.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Permitted Use</h3>
                    <p className="text-gray-700 mb-4">
                      STARS is intended for educational and research purposes only. You may:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>Search and browse thesis documents</li>
                      <li>Create personal collections for research purposes</li>
                      <li>Cite works in accordance with academic standards</li>
                      <li>Use materials for educational purposes</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Prohibited Activities</h3>
                    <p className="text-gray-700 mb-4">
                      You may not:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>Redistribute or republish thesis documents without permission</li>
                      <li>Use automated systems to download content</li>
                      <li>Attempt to gain unauthorized access to the system</li>
                      <li>Use content for commercial purposes without authorization</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Intellectual Property</h3>
                    <p className="text-gray-700">
                      All thesis documents and materials in STARS remain the intellectual property of their respective authors and 
                      De La Salle Lipa. Proper attribution must be given when citing or referencing any materials.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Termination</h3>
                    <p className="text-gray-700">
                      De La Salle Lipa reserves the right to terminate or suspend access to STARS for any violation of these terms 
                      or for any other reason deemed necessary.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Changes to Terms</h3>
                    <p className="text-gray-700">
                      These terms may be updated periodically. Continued use of STARS constitutes acceptance of any changes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

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
