
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Search, FileText, Users, Database, BarChart3, Code, Calculator, Microscope, HeartPulse, UtensilsCrossed } from 'lucide-react';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();

  const colleges = [
    {
      id: '1',
      name: 'CITE',
      fullName: 'College of Information Technology and Engineering',
      description: 'Advancing technology through innovative research',
      count: '120+ Theses',
      icon: Code,
      bgColor: 'bg-red-500',
      bgColorLight: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    {
      id: '2',
      name: 'CBEAM',
      fullName: 'College of Business, Economics, Accounting, and Management',
      description: 'Driving business excellence and economic growth',
      count: '145+ Theses',
      icon: Calculator,
      bgColor: 'bg-yellow-500',
      bgColorLight: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    {
      id: '3',
      name: 'CEAS',
      fullName: 'College of Education, Arts, and Sciences',
      description: 'Exploring knowledge across diverse disciplines',
      count: '98+ Theses',
      icon: Microscope,
      bgColor: 'bg-blue-500',
      bgColorLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: '4',
      name: 'CON',
      fullName: 'College of Nursing',
      description: 'Advancing healthcare through compassionate research',
      count: '76+ Theses',
      icon: HeartPulse,
      bgColor: 'bg-gray-500',
      bgColorLight: 'bg-gray-50',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200'
    },
    {
      id: '5',
      name: 'CIHTM',
      fullName: 'College of International Hospitality and Tourism Management',
      description: 'Shaping the future of hospitality and tourism',
      count: '63+ Theses',
      icon: UtensilsCrossed,
      bgColor: 'bg-green-500',
      bgColorLight: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
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

  const handleCollegeClick = (collegeId: string) => {
    navigate(`/college/${collegeId}`);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Fixed Background Image with Parallax */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-attachment-fixed"
        style={{
          backgroundImage: `url('/lovable-uploads/fd7995a2-1df9-4aeb-bbfb-6a33723b9835.png')`,
          willChange: 'transform'
        }}
      />

      {/* Header */}
      <header className="relative z-50 bg-white/95 backdrop-blur-lg border-b border-border">
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
              <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
              <a href="#resources" className="text-foreground hover:text-primary transition-colors">Resources</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
              <Button 
                onClick={() => navigate('/login')} 
                className="bg-primary hover:bg-primary/90 rounded-xl transition-all duration-200 hover:scale-105"
              >
                Sign In
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-in">
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
                    className="pl-10 h-12 bg-white/95 backdrop-blur-sm text-foreground rounded-xl"
                  />
                </div>
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline" 
                  className="h-12 px-6 bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-foreground rounded-xl transition-all duration-200 hover:scale-105"
                >
                  Login to Browse
                </Button>
              </div>
            </div>
            <div className="space-y-4 animate-fade-in">
              <Card className="bg-white/90 backdrop-blur-sm sleek-shadow-lg">
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
              <Card className="bg-white/90 backdrop-blur-sm sleek-shadow-lg">
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
      <section className="relative py-16">
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">Find Academic Research</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover undergraduate theses from all academic departments at De La Salle Lipa.
            </p>
          </div>

          <div className="mb-8">
            <Button 
              onClick={() => navigate('/explore')}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Browse by College
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college, index) => {
              const IconComponent = college.icon;
              return (
                <Card 
                  key={college.id} 
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm sleek-shadow hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleCollegeClick(college.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${college.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        {college.count}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {college.name}
                    </h3>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 line-clamp-2">
                      {college.fullName}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {college.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/search/advanced')}
              className="rounded-xl transition-all duration-200 hover:scale-105"
            >
              Advanced Search
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">Platform Features</h2>
            <p className="text-muted-foreground">Everything you need for academic research</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm sleek-shadow hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
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
      <section className="relative py-16">
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
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
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 flex items-center justify-center animate-fade-in">
              <div className="text-center">
                <Star className="w-24 h-24 text-primary mx-auto mb-4" />
                <BarChart3 className="w-16 h-16 text-primary/60 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-primary text-white py-16">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to start exploring?</h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Join researchers and students in discovering academic work. Sign in to access the full repository.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/login')}
              variant="secondary" 
              className="bg-white text-primary hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Star className="w-4 h-4 mr-2" />
              Sign In to STARS
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary rounded-xl transition-all duration-200 hover:scale-105"
              onClick={() => navigate('/about')}
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
