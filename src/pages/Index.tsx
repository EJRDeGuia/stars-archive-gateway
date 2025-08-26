
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Search, FileText, Users, Database, Shield, BarChart3, Settings } from 'lucide-react';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();

  const colleges = [
    {
      name: 'CITE',
      fullName: 'College of Information Technology and Engineering',
      description: 'Advancing technology through innovative research',
      count: '120+ Theses',
      color: 'bg-red-100 border-red-200',
      icon: '💻'
    },
    {
      name: 'CBEAM',
      fullName: 'College of Business, Economics, Accounting, and Management',
      description: 'Driving business excellence and economic growth',
      count: '145+ Theses',
      color: 'bg-yellow-100 border-yellow-200',
      icon: '📊'
    },
    {
      name: 'CEAS',
      fullName: 'College of Education, Arts, and Sciences',
      description: 'Exploring knowledge across diverse disciplines',
      count: '98+ Theses',
      color: 'bg-blue-100 border-blue-200',
      icon: '📚'
    },
    {
      name: 'CON',
      fullName: 'College of Nursing',
      description: 'Advancing healthcare through compassionate research',
      count: '76+ Theses',
      color: 'bg-gray-100 border-gray-200',
      icon: '🏥'
    },
    {
      name: 'CIHTM',
      fullName: 'College of International Hospitality and Tourism Management',
      description: 'Shaping the future of hospitality and tourism',
      count: '63+ Theses',
      color: 'bg-green-100 border-green-200',
      icon: '🏨'
    }
  ];

  const features = [
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Find relevant research quickly with our powerful search engine and intelligent filtering.'
    },
    {
      icon: FileText,
      title: 'Digital Library',
      description: 'Access and read theses directly in your browser with our document viewer.'
    },
    {
      icon: Database,
      title: 'Secure Repository',
      description: 'Safe and reliable storage for all academic research with proper access controls.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track research trends and citation metrics with comprehensive analytics.'
    }
  ];

  const managementFeatures = [
    'Intelligent search and categorization',
    'Role-based access control',
    'Department-specific organization',
    'Secure cloud storage'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">STARS</h1>
                <p className="text-xs text-muted-foreground">De La Salle Lipa</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-foreground hover:text-primary">About</a>
              <a href="#" className="text-foreground hover:text-primary">Resources</a>
              <a href="#" className="text-foreground hover:text-primary">Contact</a>
              <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-primary/90">
                Sign In
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat py-24"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('/lovable-uploads/fd7995a2-1df9-4aeb-bbfb-6a33723b9835.png')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2" />
                De La Salle Lipa - Learning Resource Center
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Smart Thesis Archival and Retrieval System
              </h1>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                A modern platform for managing, discovering, and accessing academic research at De La Salle Lipa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    placeholder="Start Exploring..." 
                    className="pl-10 h-12 bg-white text-foreground"
                  />
                </div>
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline" 
                  className="h-12 px-6 bg-transparent border-white text-white hover:bg-white hover:text-foreground"
                >
                  Login to Browse
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">500+ Theses</p>
                    <p className="text-sm text-muted-foreground">Available Online</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">5 Colleges</p>
                    <p className="text-sm text-muted-foreground">Academic Research</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Find Academic Research Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Find Academic Research</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover undergraduate theses from all academic departments at De La Salle Lipa.
            </p>
          </div>

          <div className="mb-8">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3">
              Browse by College
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college, index) => (
              <Card key={index} className={`${college.color} hover:shadow-lg transition-shadow cursor-pointer`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{college.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{college.name}</h3>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">{college.fullName}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{college.description}</p>
                  <Badge variant="secondary" className="bg-white/80">
                    {college.count}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => navigate('/search/advanced')}>
              Advanced Search
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Platform Features</h2>
            <p className="text-muted-foreground">Everything you need for academic research</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Research Management */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Academic Research Management</h2>
              <p className="text-muted-foreground mb-8">
                STARS provides a comprehensive platform for managing and accessing academic research with modern tools and intuitive design.
              </p>
              <div className="space-y-4">
                {managementFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 flex items-center justify-center">
              <div className="text-center">
                <Star className="w-24 h-24 text-primary mx-auto mb-4" />
                <BarChart3 className="w-16 h-16 text-primary/60 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to start exploring?</h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Join researchers and students in discovering academic work. Sign in to access the full repository.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/login')}
              variant="secondary" 
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Star className="w-4 h-4 mr-2" />
              Sign In to STARS
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
