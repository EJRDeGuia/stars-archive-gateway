
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Search, FileText, Users, Database, Code, Calculator, Microscope, HeartPulse, UtensilsCrossed, BookOpen, Shield, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
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
      <div className="fixed inset-0 bg-black/50" />

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
                  onClick={() => navigate('/explore')}
                  className="h-12 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg font-semibold"
                >
                  Start Exploring
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline" 
                  className="h-12 px-6 bg-white/15 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-foreground rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Login to Browse
                </Button>
              </div>
            </div>
            
            {/* Circular Badges for Stats */}
            <div className="flex items-center justify-center lg:justify-end space-x-8 animate-fade-in">
              <div className="text-center group">
                <div className="w-32 h-32 bg-white/95 backdrop-blur-lg rounded-full flex flex-col items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-110 border-4 border-white/20">
                  <BookOpen className="w-8 h-8 text-primary mb-2" />
                  <p className="text-3xl font-bold text-foreground">500+</p>
                  <p className="text-sm font-medium text-muted-foreground">Theses</p>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="w-32 h-32 bg-white/95 backdrop-blur-lg rounded-full flex flex-col items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-110 border-4 border-white/20">
                  <Users className="w-8 h-8 text-blue-500 mb-2" />
                  <p className="text-3xl font-bold text-foreground">5</p>
                  <p className="text-sm font-medium text-muted-foreground">Colleges</p>
                </div>
              </div>
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
                className="text-center hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm border-0 rounded-2xl hover:scale-105 animate-fade-in shadow-lg group"
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
                <Database className="w-24 h-24 text-primary mx-auto" />
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

      {/* Footer */}
      <footer className="bg-primary text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Logo and Description */}
            <div className="md:col-span-5">
              <div className="flex items-center mb-4">
                <Star className="h-8 w-8 mr-2 fill-white" />
                <h3 className="text-2xl font-bold">STARS</h3>
              </div>
              <p className="text-white/90 mb-6 max-w-md">
                Smart Thesis Archival and Retrieval System (STARS) - A modern
                platform for thesis management at De La Salle Lipa. Enabling students, 
                faculty, and researchers to discover academic knowledge.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate('/')} className="text-white/80 hover:text-white transition-colors text-left">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/about')} className="text-white/80 hover:text-white transition-colors hover:underline text-left">
                    About STARS
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/resources')} className="text-white/80 hover:text-white transition-colors hover:underline text-left">
                    Resources
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/login')} className="text-white/80 hover:text-white transition-colors hover:underline text-left">
                    Login
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate('/resources#user-guide')} className="text-white/80 hover:text-white transition-colors hover:underline text-left">
                    User Guide
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/resources#help-center')} className="text-white/80 hover:text-white transition-colors hover:underline text-left">
                    Help Center
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/resources#research-format')} className="text-white/80 hover:text-white transition-colors hover:underline text-left">
                    Research Format
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/resources#faq')} className="text-white/80 hover:text-white transition-colors hover:underline text-left">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-3">
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-white/90">
                    De La Salle Lipa<br />
                    Learning Resource Center<br />
                    Lipa City, Batangas
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  <a 
                    href="tel:+6343123456" 
                    className="text-white/90 hover:text-white transition-colors hover:underline"
                  >
                    (043) 123-4567
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <a 
                    href="mailto:lrc@dlsl.edu.ph" 
                    className="text-white/90 hover:text-white transition-colors hover:underline"
                  >
                    lrc@dlsl.edu.ph
                  </a>
                </li>
                <li className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  <a 
                    href="https://www.dlsl.edu.ph" 
                    className="text-white/90 hover:text-white transition-colors hover:underline"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    www.dlsl.edu.ph
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-white/20" />

          <div className="flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
            <p>© 2025 De La Salle Lipa - Learning Resource Center. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <button onClick={() => navigate('/resources#privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => navigate('/resources#terms-of-service')} className="hover:text-white transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
