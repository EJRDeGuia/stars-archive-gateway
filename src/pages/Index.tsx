
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Search, Users, Shield } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to dashboard if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dlsl-green/10 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-dlsl-green" />
              <h1 className="text-2xl font-bold text-gray-900">DLSL Thesis Repository</h1>
            </div>
            <Button onClick={() => navigate('/login')} className="bg-dlsl-green hover:bg-dlsl-green/90">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            De La Salle Lipa University
          </h2>
          <h3 className="text-2xl text-gray-600 mb-6">
            Digital Thesis Repository System
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Access and explore academic research from DLSL's finest scholars. 
            Discover theses, conduct advanced searches, and contribute to the academic community.
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')} 
              className="bg-dlsl-green hover:bg-dlsl-green/90"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/about')}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Search className="h-8 w-8 text-dlsl-green mx-auto mb-2" />
              <CardTitle className="text-lg">Advanced Search</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find specific research with powerful search filters and semantic search capabilities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-dlsl-green mx-auto mb-2" />
              <CardTitle className="text-lg">Digital Library</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access a comprehensive collection of academic theses from various colleges and programs.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 text-dlsl-green mx-auto mb-2" />
              <CardTitle className="text-lg">Role-Based Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Secure access control for researchers, archivists, and administrators with appropriate permissions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-8 w-8 text-dlsl-green mx-auto mb-2" />
              <CardTitle className="text-lg">Secure Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Protected academic content with audit trails and compliance with institutional policies.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Colleges Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-center mb-8">Explore by College</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['CITE', 'CBEAM', 'CEAS', 'CON', 'CIHTM'].map((college) => (
              <div key={college} className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <p className="font-semibold text-dlsl-green">{college}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 De La Salle Lipa University. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
