
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Search, Book, Shield, Building, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-6 h-6 text-dlsl-green" />
              <h1 className="text-xl font-bold text-dlsl-green">STARS</h1>
            </div>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-dlsl-green text-white hover:bg-dlsl-green-dark"
            >
              Sign in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-dlsl-green mb-6">
              Smart Thesis Archival and Retrieval System
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A modern platform for managing, discovering, and accessing academic research
              at De La Salle Lipa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-dlsl-green text-white hover:bg-dlsl-green-dark"
              >
                <Search className="mr-2 h-5 w-5" />
                Search Theses
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-dlsl-green text-dlsl-green hover:bg-dlsl-green/10"
              >
                <Book className="mr-2 h-5 w-5" />
                Browse Collections
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dlsl-green flex items-center justify-center">
              <Building className="mr-2 h-6 w-6" />
              Explore Departments
            </h2>
            <div className="mt-2 w-16 h-1 bg-dlsl-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* CITE */}
            <Card className="overflow-hidden border-t-4 border-t-red-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <div className="bg-red-500 text-white p-2 rounded-full">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800">CITE</h3>
                    <p className="text-sm text-gray-600">College of Information Technology and Engineering</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Focuses on engineering and IT-related studies.</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Book className="h-4 w-4 mr-1" />
                  <span>120+ Theses</span>
                  <span className="mx-2">•</span>
                  <span>Since 2020</span>
                </div>
                <Button 
                  variant="link" 
                  className="text-red-500 pl-0 hover:text-red-700"
                  onClick={() => navigate('/college/1')}
                >
                  Explore theses →
                </Button>
              </CardContent>
            </Card>

            {/* CBEAM */}
            <Card className="overflow-hidden border-t-4 border-t-yellow-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <div className="bg-yellow-500 text-white p-2 rounded-full">
                      <Building className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800">CBEAM</h3>
                    <p className="text-sm text-gray-600">College of Business, Economics, Accountancy, and Management</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Dedicated to business and financial disciplines.</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Book className="h-4 w-4 mr-1" />
                  <span>120+ Theses</span>
                  <span className="mx-2">•</span>
                  <span>Since 2020</span>
                </div>
                <Button 
                  variant="link" 
                  className="text-yellow-500 pl-0 hover:text-yellow-700"
                  onClick={() => navigate('/college/2')}
                >
                  Explore theses →
                </Button>
              </CardContent>
            </Card>

            {/* CEAS */}
            <Card className="overflow-hidden border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <div className="bg-blue-500 text-white p-2 rounded-full">
                      <Book className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800">CEAS</h3>
                    <p className="text-sm text-gray-600">College of Education, Arts, and Sciences</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Covers educational, artistic, and scientific research areas.</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Book className="h-4 w-4 mr-1" />
                  <span>120+ Theses</span>
                  <span className="mx-2">•</span>
                  <span>Since 2020</span>
                </div>
                <Button 
                  variant="link" 
                  className="text-blue-500 pl-0 hover:text-blue-700"
                  onClick={() => navigate('/college/3')}
                >
                  Explore theses →
                </Button>
              </CardContent>
            </Card>

            {/* CON */}
            <Card className="overflow-hidden border-t-4 border-t-gray-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <div className="bg-gray-500 text-white p-2 rounded-full">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800">CON</h3>
                    <p className="text-sm text-gray-600">College of Nursing</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Pertains to nursing and healthcare-focused research.</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Book className="h-4 w-4 mr-1" />
                  <span>120+ Theses</span>
                  <span className="mx-2">•</span>
                  <span>Since 2020</span>
                </div>
                <Button 
                  variant="link" 
                  className="text-gray-500 pl-0 hover:text-gray-700"
                  onClick={() => navigate('/college/4')}
                >
                  Explore theses →
                </Button>
              </CardContent>
            </Card>

            {/* CIHTM */}
            <Card className="overflow-hidden border-t-4 border-t-green-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <div className="bg-green-500 text-white p-2 rounded-full">
                      <Building className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800">CIHTM</h3>
                    <p className="text-sm text-gray-600">College of International Hospitality and Tourism Management</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Highlights hospitality and tourism studies.</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Book className="h-4 w-4 mr-1" />
                  <span>120+ Theses</span>
                  <span className="mx-2">•</span>
                  <span>Since 2020</span>
                </div>
                <Button 
                  variant="link" 
                  className="text-green-500 pl-0 hover:text-green-700"
                  onClick={() => navigate('/college/5')}
                >
                  Explore theses →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-dlsl-green mb-6">
                Advanced Thesis Management
              </h2>
              <p className="text-gray-600 mb-8">
                STARS provides a comprehensive solution for thesis archival, retrieval, and
                management. With advanced search capabilities, AI-powered insights, and secure
                access controls, STARS transforms how academic research is managed and accessed.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-dlsl-green mr-2 flex-shrink-0" />
                  <p className="text-gray-600">Role-based access control for students, faculty, and administrators</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-dlsl-green mr-2 flex-shrink-0" />
                  <p className="text-gray-600">AI-powered semantic search and thesis summarization</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-dlsl-green mr-2 flex-shrink-0" />
                  <p className="text-gray-600">Department-specific organization and categorization</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-dlsl-green mr-2 flex-shrink-0" />
                  <p className="text-gray-600">Secure document storage and retrieval</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-dlsl-green mr-2 flex-shrink-0" />
                  <p className="text-gray-600">Analytics and reporting for research trends</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="aspect-square w-full bg-dlsl-green/20 rounded-lg flex items-center justify-center">
                <Book className="h-24 w-24 text-dlsl-green opacity-40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
