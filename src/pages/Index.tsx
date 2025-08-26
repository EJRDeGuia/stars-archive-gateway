
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Search, FileText, Users, Database, Code, Calculator, Microscope, HeartPulse, UtensilsCrossed, BookOpen, Shield } from 'lucide-react';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import { useCollegesWithCounts } from '@/hooks/useCollegesWithCounts';

const Index = () => {
  const navigate = useNavigate();
  const { data: colleges = [], isLoading } = useCollegesWithCounts();

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
      {/* Fixed Background Image with Parallax - More Dimmed */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-attachment-fixed"
        style={{
          backgroundImage: `url('/lovable-uploads/fd7995a2-1df9-4aeb-bbfb-6a33723b9835.png')`,
          willChange: 'transform'
        }}
      />
      
      {/* Darker overlay for better readability */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Header */}
      <header className="relative z-50 bg-white/90 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
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
                className="bg-primary hover:bg-primary/90 rounded-xl transition-all duration-200 hover:scale-105 shadow-md"
              >
                Sign In
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 min-h-screen flex items-center">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-in">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
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
                    className="pl-10 h-12 bg-white/90 backdrop-blur-sm text-foreground rounded-xl border-0 shadow-lg"
                  />
                </div>
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline" 
                  className="h-12 px-6 bg-white/15 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-foreground rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Login to Browse
                </Button>
              </div>
            </div>
            
            {/* Enhanced Hero Cards */}
            <div className="space-y-6 animate-fade-in">
              <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-2xl rounded-2xl overflow-hidden group hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold text-foreground mb-2">500+</p>
                      <p className="text-lg font-medium text-muted-foreground">Theses Available</p>
                      <p className="text-sm text-muted-foreground/80 mt-1">Across all departments</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-2xl rounded-2xl overflow-hidden group hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold text-foreground mb-2">5</p>
                      <p className="text-lg font-medium text-muted-foreground">Academic Colleges</p>
                      <p className="text-sm text-muted-foreground/80 mt-1">Diverse research fields</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Find Academic Research Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-6">Find Academic Research</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover undergraduate theses from all academic departments at De La Salle Lipa. 
              Explore cutting-edge research across diverse fields of study.
            </p>
          </div>

          <div className="mb-12">
            <Button 
              onClick={() => navigate('/explore')}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 text-lg rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Browse by College
            </Button>
          </div>

          {/* College Cards using CollegeCard component */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 rounded-2xl h-80"></div>
                </div>
              ))
            ) : (
              colleges.map((college, index) => (
                <div
                  key={college.id}
                  className="animate-fade-in hover:scale-105 transition-transform duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CollegeCard
                    college={college}
                    onClick={() => handleCollegeClick(college.id)}
                  />
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              onClick={() => navigate('/search/advanced')}
              className="rounded-2xl px-8 py-3 text-lg transition-all duration-200 hover:scale-105 shadow-md border-2"
            >
              Advanced Search
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-6">Platform Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for academic research and thesis management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm border-0 rounded-2xl hover:scale-105 animate-fade-in shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Research Management */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold text-foreground mb-8">Academic Research Management</h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                STARS provides a comprehensive platform for managing and accessing academic research with modern tools and intuitive design.
              </p>
              <div className="space-y-6">
                {managementFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-foreground text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-12 flex items-center justify-center animate-fade-in shadow-lg">
              <div className="text-center">
                <Shield className="w-24 h-24 text-primary mx-auto mb-6" />
                <Database className="w-16 h-16 text-primary/60 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-primary text-white py-20">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to start exploring?</h2>
          <p className="text-xl mb-10 text-primary-foreground/90 leading-relaxed">
            Join researchers and students in discovering academic work. Sign in to access the full repository.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={() => navigate('/login')}
              variant="secondary" 
              className="bg-white text-primary hover:bg-gray-100 rounded-2xl px-8 py-4 text-lg transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Star className="w-5 h-5 mr-2" />
              Sign In to STARS
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary rounded-2xl px-8 py-4 text-lg transition-all duration-200 hover:scale-105 shadow-lg"
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
