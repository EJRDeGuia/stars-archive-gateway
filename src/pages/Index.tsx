
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Search, Upload, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dlsl-green to-dlsl-green-light">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-dlsl-green" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">STARS</h1>
                <p className="text-xs text-white/80">Smart Thesis Archival & Retrieval System</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-white text-dlsl-green hover:bg-white/90"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="text-dlsl-gold">STARS</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            De La Salle Lipa's comprehensive digital repository for undergraduate theses. 
            Discover, research, and contribute to academic excellence across all colleges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-dlsl-gold text-dlsl-green-dark hover:bg-dlsl-gold/90 font-semibold"
            >
              Get Started
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-dlsl-green"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Search className="w-12 h-12 text-dlsl-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
              <p className="text-white/80">
                Powerful search capabilities across all colleges and departments
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Upload className="w-12 h-12 text-dlsl-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Archival</h3>
              <p className="text-white/80">
                Streamlined process for uploading and organizing thesis documents
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-dlsl-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
              <p className="text-white/80">
                Role-based permissions ensuring proper access control
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Colleges Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Serving Five Distinguished Colleges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'CITE', full: 'College of Information Technology & Engineering' },
              { name: 'CBEAM', full: 'College of Business, Economics, Accountancy & Management' },
              { name: 'CEAS', full: 'College of Education, Arts & Sciences' },
              { name: 'CIHTM', full: 'College of International Hospitality and Tourism Management' },
              { name: 'CON', full: 'College of Nursing' }
            ].map((college) => (
              <Card key={college.name} className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-colors">
                <CardContent className="p-4 text-center">
                  <h3 className="text-lg font-bold text-dlsl-gold mb-2">{college.name}</h3>
                  <p className="text-sm text-white/80">{college.full}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
