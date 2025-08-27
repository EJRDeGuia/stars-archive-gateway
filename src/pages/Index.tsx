
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, FileText, Users, Database, Shield, FolderOpen, Cloud, Search as SearchIcon, Menu, X, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import CollegeCard from '@/components/CollegeCard';
import { useCollegesWithCounts } from '@/hooks/useCollegesWithCounts';

const Index = () => {
  const navigate = useNavigate();
  const { data: colleges = [], isLoading } = useCollegesWithCounts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: SearchIcon,
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
    {
      icon: SearchIcon,
      title: 'Intelligent Search & Categorization',
      description: 'Advanced search algorithms to find exactly what you need'
    },
    {
      icon: Shield,
      title: 'Role-based Access Control',
      description: 'Secure permissions system for different user types'
    },
    {
      icon: FolderOpen,
      title: 'Department-specific Organization',
      description: 'Content organized by academic departments and disciplines'
    },
    {
      icon: Cloud,
      title: 'Secure Cloud Storage',
      description: 'Reliable and secure cloud infrastructure for all documents'
    }
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
      <header className="relative z-50 bg-white/95 backdrop-blur-xl border-b border-border/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">STARS</h1>
                <p className="text-sm text-muted-foreground font-medium">De La Salle Lipa</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-10">
              <a href="#about" className="text-foreground/80 hover:text-primary transition-all duration-200 font-medium hover:scale-105">About</a>
              <a href="#resources" className="text-foreground/80 hover:text-primary transition-all duration-200 font-medium hover:scale-105">Resources</a>
              <a href="#contact" className="text-foreground/80 hover:text-primary transition-all duration-200 font-medium hover:scale-105">Contact</a>
              <Button 
                onClick={() => navigate('/login')} 
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg px-6 py-2.5 font-semibold"
              >
                Sign In
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-background/80 transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-border/50 shadow-xl animate-fade-in">
              <nav className="px-4 py-6 space-y-4">
                <a href="#about" className="block text-foreground/80 hover:text-primary transition-colors font-medium py-2">About</a>
                <a href="#resources" className="block text-foreground/80 hover:text-primary transition-colors font-medium py-2">Resources</a>
                <a href="#contact" className="block text-foreground/80 hover:text-primary transition-colors font-medium py-2">Contact</a>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary rounded-2xl transition-all duration-300 shadow-lg font-semibold"
                >
                  Sign In
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 min-h-screen flex items-center">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white animate-fade-in">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/30 shadow-lg">
                <Star className="w-5 h-5 mr-3 text-white" />
                De La Salle Lipa - Learning Resource Center
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                Smart Thesis Archival and Retrieval System
              </h1>
              <p className="text-xl lg:text-2xl mb-12 text-white/95 leading-relaxed max-w-2xl">
                A modern platform for managing, discovering, and accessing academic research at De La Salle Lipa.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 max-w-md">
                <Button 
                  onClick={() => navigate('/explore')}
                  className="h-14 px-10 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl font-semibold text-lg"
                >
                  Start Exploring
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline" 
                  className="h-14 px-8 bg-white/20 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white hover:text-foreground rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl font-semibold text-lg"
                >
                  Login to Browse
                </Button>
              </div>
            </div>
            
            {/* Enhanced Circular Badges for Stats */}
            <div className="flex items-center justify-center lg:justify-end space-x-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="text-center group">
                <div className="relative w-40 h-40 bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-xl rounded-full flex flex-col items-center justify-center shadow-2xl group-hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 group-hover:scale-110 border-4 border-white/30 group-hover:border-white/50">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-500"></div>
                  <BookOpen className="w-10 h-10 text-primary mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-4xl font-bold text-foreground relative z-10 group-hover:text-primary transition-colors duration-300">500+</p>
                  <p className="text-base font-semibold text-muted-foreground relative z-10">Theses</p>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="relative w-40 h-40 bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-xl rounded-full flex flex-col items-center justify-center shadow-2xl group-hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 group-hover:scale-110 border-4 border-white/30 group-hover:border-white/50">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/5 to-blue-500/10 group-hover:from-blue-500/10 group-hover:to-blue-500/20 transition-all duration-500"></div>
                  <Users className="w-10 h-10 text-blue-500 mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-4xl font-bold text-foreground relative z-10 group-hover:text-blue-500 transition-colors duration-300">5</p>
                  <p className="text-base font-semibold text-muted-foreground relative z-10">Colleges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find Academic Research Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-5xl font-bold text-foreground mb-8">Find Academic Research</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Discover undergraduate theses from all academic departments at De La Salle Lipa. 
              Explore cutting-edge research across diverse fields of study.
            </p>
          </div>

          <div className="mb-16">
            <Button 
              onClick={() => navigate('/explore')}
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold py-6 text-xl rounded-3xl transition-all duration-300 hover:scale-[1.02] shadow-2xl"
            >
              Browse by College
            </Button>
          </div>

          {/* College Cards in Staggered Layout */}
          <div className="space-y-8">
            {isLoading ? (
              <>
                <div className="grid md:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-300 rounded-3xl h-80"></div>
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-8 md:px-16">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index + 3} className="animate-pulse">
                      <div className="bg-gray-300 rounded-3xl h-80"></div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* First Row - 3 Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                  {colleges.slice(0, 3).map((college, index) => (
                    <div
                      key={college.id}
                      className="animate-fade-in hover:scale-105 transition-all duration-300 group"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <CollegeCard
                        college={college}
                        onClick={() => handleCollegeClick(college.id)}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Second Row - 2 Cards Centered */}
                {colleges.length > 3 && (
                  <div className="grid md:grid-cols-2 gap-8 md:px-16 lg:px-20">
                    {colleges.slice(3, 5).map((college, index) => (
                      <div
                        key={college.id}
                        className="animate-fade-in hover:scale-105 transition-all duration-300 group"
                        style={{ animationDelay: `${(index + 3) * 150}ms` }}
                      >
                        <CollegeCard
                          college={college}
                          onClick={() => handleCollegeClick(college.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="text-center mt-16">
            <Button 
              variant="outline" 
              onClick={() => navigate('/search/advanced')}
              className="rounded-3xl px-10 py-4 text-xl transition-all duration-300 hover:scale-105 shadow-lg border-2 border-primary/20 hover:border-primary/40 hover:shadow-xl font-semibold"
            >
              Advanced Search
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-5xl font-bold text-foreground mb-8">Platform Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Everything you need for academic research and thesis management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-md border-0 rounded-3xl hover:scale-[1.08] animate-fade-in shadow-xl group hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 via-primary/25 to-primary/30 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <feature.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-6 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Research Management */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-5xl font-bold text-foreground mb-8">Academic Research Management</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              STARS provides a comprehensive platform for managing and accessing academic research with modern tools and intuitive design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {managementFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="group p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 hover:bg-white/95 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-primary text-white py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold mb-8">Ready to start exploring?</h2>
          <p className="text-2xl mb-12 text-white/95 leading-relaxed max-w-3xl mx-auto">
            Join researchers and students in discovering academic work. Sign in to access the full repository.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Button 
              onClick={() => navigate('/login')}
              variant="secondary" 
              className="bg-white text-primary hover:bg-gray-50 rounded-3xl px-10 py-5 text-xl transition-all duration-300 hover:scale-105 shadow-2xl font-semibold"
            >
              <Star className="w-6 h-6 mr-3" />
              Sign In to STARS
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary rounded-3xl px-10 py-5 text-xl transition-all duration-300 hover:scale-105 shadow-xl font-semibold"
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
