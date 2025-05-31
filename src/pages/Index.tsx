
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Book, CheckCircle2, Users, BarChart3, FileText, ChevronRight, Code, Calculator, Microscope, HeartPulse, UtensilsCrossed, Star, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const navigate = useNavigate();
  const collegeData = [{
    id: '1',
    name: 'CITE',
    fullName: 'College of Information Technology and Engineering',
    color: 'red',
    thesesCount: 120,
    icon: <Code className="h-6 w-6" />,
    description: 'Advancing technology through innovative research'
  }, {
    id: '2',
    name: 'CBEAM',
    fullName: 'College of Business, Economics, Accountancy, and Management',
    color: 'yellow',
    thesesCount: 145,
    icon: <Calculator className="h-6 w-6" />,
    description: 'Driving business excellence and economic growth'
  }, {
    id: '3',
    name: 'CEAS',
    fullName: 'College of Education, Arts, and Sciences',
    color: 'blue',
    thesesCount: 98,
    icon: <Microscope className="h-6 w-6" />,
    description: 'Exploring knowledge across diverse disciplines'
  }, {
    id: '4',
    name: 'CON',
    fullName: 'College of Nursing',
    color: 'gray',
    thesesCount: 76,
    icon: <HeartPulse className="h-6 w-6" />,
    description: 'Advancing healthcare through compassionate research'
  }, {
    id: '5',
    name: 'CIHTM',
    fullName: 'College of International Hospitality and Tourism Management',
    color: 'green',
    thesesCount: 110,
    icon: <UtensilsCrossed className="h-6 w-6" />,
    description: 'Shaping the future of hospitality and tourism'
  }];

  const getCollegeColors = (color: string) => {
    switch (color) {
      case 'red':
        return {
          gradient: 'from-red-500 to-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-600',
          hover: 'hover:shadow-red-100'
        };
      case 'yellow':
        return {
          gradient: 'from-yellow-500 to-amber-500',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-600',
          hover: 'hover:shadow-yellow-100'
        };
      case 'blue':
        return {
          gradient: 'from-blue-500 to-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-600',
          hover: 'hover:shadow-blue-100'
        };
      case 'green':
        return {
          gradient: 'from-green-500 to-emerald-500',
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-600',
          hover: 'hover:shadow-green-100'
        };
      default:
        return {
          gradient: 'from-gray-500 to-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-600',
          hover: 'hover:shadow-gray-100'
        };
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(/lovable-uploads/83b8c064-b1bc-4c93-b353-78a1467e8d8d.png)`,
            filter: 'brightness(0.4) blur(2px)',
            transform: 'scale(1.05)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-900/40" />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header */}
        <header className="glass-effect sticky top-0 z-50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-dlsl-green to-dlsl-green-dark rounded-xl flex items-center justify-center sleek-shadow-xl animate-scale-in">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="animate-fade-in">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent tracking-tight">STARS</h1>
                  <p className="text-xs text-slate-400 font-medium">De La Salle Lipa</p>
                </div>
              </div>
              
              <div className="hidden md:flex space-x-1">
                <NavigationMenu>
                  <NavigationMenuList className="space-x-2">
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-slate-300 hover:text-white bg-transparent hover:bg-white/10 transition-all duration-300 rounded-xl">About</NavigationMenuTrigger>
                      <NavigationMenuContent className="glass-effect border-white/20">
                        <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px]">
                          <li className="row-span-3">
                            <NavigationMenuLink asChild>
                              <a className="flex h-full w-full select-none flex-col justify-end rounded-xl bg-gradient-to-b from-dlsl-green/20 to-dlsl-green/30 p-6 no-underline outline-none focus:shadow-md backdrop-blur-sm border border-white/10" href="#">
                                <div className="mb-2 mt-4 text-lg font-bold text-white">
                                  Smart Thesis Archival and Retrieval System
                                </div>
                                <p className="text-sm leading-tight text-slate-300">
                                  STARS is a modern platform for storing, managing, and retrieving academic research at De La Salle Lipa.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          <ListItem href="#" title="Introduction">
                            Learn about the system and its features
                          </ListItem>
                          <ListItem href="#" title="How It Works">
                            Understand the thesis submission process
                          </ListItem>
                          <ListItem href="#" title="For Researchers">
                            Special features for academic researchers
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-slate-300 hover:text-white bg-transparent hover:bg-white/10 transition-all duration-300 rounded-xl">Resources</NavigationMenuTrigger>
                      <NavigationMenuContent className="glass-effect border-white/20">
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                          <ListItem href="#" title="User Guide">
                            Step-by-step guides to using STARS
                          </ListItem>
                          <ListItem href="#" title="Help Center">
                            FAQ and troubleshooting
                          </ListItem>
                          <ListItem href="#" title="Research Standards">
                            Format and citation guidelines
                          </ListItem>
                          <ListItem href="#" title="Contact Support">
                            Get help from the STARS team
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-slate-300 hover:text-white bg-transparent hover:bg-white/10 transition-all duration-300 rounded-xl")}>
                        Contact
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              <Button 
                onClick={() => navigate('/login')} 
                className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark hover:from-dlsl-green-dark hover:to-dlsl-green sleek-shadow-xl hover:sleek-shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl px-6 py-3 font-semibold text-white border-0 animate-scale-in"
              >
                Sign in
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-slide-up">
                <div className="inline-flex items-center glass-effect px-6 py-3 rounded-full text-sm font-semibold border border-white/20 sleek-shadow-xl bg-white/5 animate-fade-in">
                  <Sparkles className="w-4 h-4 mr-3 text-dlsl-green" />
                  <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">De La Salle Lipa • Learning Resource Center</span>
                </div>
                
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                    <span className="block bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent">Smart Thesis</span>
                    <span className="block bg-gradient-to-r from-dlsl-green via-dlsl-green-light to-emerald-400 bg-clip-text text-transparent">Archival and</span>
                    <span className="block bg-gradient-to-r from-slate-200 via-white to-slate-300 bg-clip-text text-transparent">Retrieval System</span>
                  </h1>
                  <p className="text-xl text-slate-300 leading-relaxed max-w-2xl font-medium">
                    A modern platform for managing, discovering, and accessing academic research at De La Salle Lipa with powerful search capabilities.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark hover:from-dlsl-green-dark hover:to-dlsl-green sleek-shadow-xl hover:sleek-shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl px-8 py-4 text-white font-semibold text-lg border-0"
                    onClick={() => {
                      const searchSection = document.getElementById('search-section');
                      searchSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Search className="mr-3 h-5 w-5" />
                    Start Exploring
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => navigate('/login')} 
                    className="glass-effect border-white/30 text-white hover:bg-white/10 sleek-shadow-lg hover:sleek-shadow-xl transition-all duration-300 rounded-xl px-8 py-4 font-semibold text-lg"
                  >
                    <Book className="mr-3 h-5 w-5" />
                    Login to Browse
                  </Button>
                </div>
              </div>
              
              <div className="hidden md:flex justify-center animate-scale-in">
                <div className="relative">
                  <div className="w-96 h-96 glass-effect flex items-center justify-center border border-white/20 sleek-shadow-2xl rounded-2xl bg-gradient-to-br from-dlsl-green/10 to-dlsl-green-dark/20">
                    <Star className="h-40 w-40 text-white/90" />
                  </div>
                  
                  {/* Stats cards */}
                  <div className="absolute -top-6 -right-6 glass-effect rounded-xl sleek-shadow-xl p-6 border border-white/20 animate-slide-down">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-dlsl-green to-dlsl-green-dark rounded-xl flex items-center justify-center sleek-shadow-lg">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">500+ Theses</p>
                        <p className="text-sm text-slate-300">Available now</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-6 -left-6 glass-effect rounded-xl sleek-shadow-xl p-6 border border-white/20 animate-slide-up">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-dlsl-green to-emerald-500 rounded-xl flex items-center justify-center sleek-shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">5 Colleges</p>
                        <p className="text-sm text-slate-300">Academic research</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section id="search-section" className="py-20 glass-effect border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-6">Find Academic Research</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-dlsl-green to-dlsl-green-light mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Discover undergraduate theses from all academic departments at De La Salle Lipa with our advanced search system.
              </p>
            </div>

            <Tabs defaultValue="colleges" className="w-full max-w-5xl mx-auto animate-slide-up">
              <TabsList className="grid w-full grid-cols-2 mb-12 glass-effect border border-white/20 rounded-xl p-2">
                <TabsTrigger 
                  value="colleges" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-dlsl-green data-[state=active]:to-dlsl-green-dark data-[state=active]:text-white text-slate-300 font-semibold rounded-lg transition-all duration-300 py-3"
                >
                  Browse by College
                </TabsTrigger>
                <TabsTrigger 
                  value="search" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-dlsl-green data-[state=active]:to-dlsl-green-dark data-[state=active]:text-white text-slate-300 font-semibold rounded-lg transition-all duration-300 py-3"
                >
                  Advanced Search
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="colleges">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {collegeData.map((college, index) => {
                    const colors = getCollegeColors(college.color);
                    return (
                      <Card 
                        key={college.name} 
                        className="group cursor-pointer glass-effect border border-white/20 sleek-shadow-lg hover:sleek-shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl overflow-hidden animate-scale-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => navigate(`/college/${college.id}`)}
                      >
                        <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>
                        <CardContent className="p-8">
                          <div className="flex items-center mb-6">
                            <div className={`${colors.bg} p-4 rounded-xl border ${colors.border} sleek-shadow`}>
                              {college.icon}
                            </div>
                            <div className="ml-6">
                              <h3 className="font-bold text-white text-lg">{college.name}</h3>
                              <p className="text-sm text-slate-400 font-medium">{college.fullName}</p>
                            </div>
                          </div>
                          <p className="text-slate-300 mb-6 leading-relaxed">{college.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 font-medium">
                              <Book className="h-4 w-4 inline mr-2" />
                              {college.thesesCount}+ Theses
                            </span>
                            <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-dlsl-green transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="search">
                <Card className="glass-effect border border-white/20 rounded-xl overflow-hidden animate-fade-in">
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      <div className="relative">
                        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
                        <input 
                          type="text" 
                          placeholder="Search by title, author, keywords..." 
                          className="w-full pl-16 pr-6 py-5 glass-effect border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-dlsl-green/50 focus:border-dlsl-green/50 text-white placeholder-slate-400 text-lg font-medium transition-all duration-300"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <select className="p-5 glass-effect border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-dlsl-green/50 text-white bg-transparent font-medium">
                          <option value="" className="bg-slate-800">All Colleges</option>
                          {collegeData.map(college => 
                            <option key={college.id} value={college.id} className="bg-slate-800">{college.name}</option>
                          )}
                        </select>
                        <select className="p-5 glass-effect border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-dlsl-green/50 text-white bg-transparent font-medium">
                          <option value="" className="bg-slate-800">All Years</option>
                          <option value="2024" className="bg-slate-800">2024</option>
                          <option value="2023" className="bg-slate-800">2023</option>
                          <option value="2022" className="bg-slate-800">2022</option>
                        </select>
                        <select className="p-5 glass-effect border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-dlsl-green/50 text-white bg-transparent font-medium">
                          <option value="relevance" className="bg-slate-800">Relevance</option>
                          <option value="newest" className="bg-slate-800">Newest First</option>
                          <option value="oldest" className="bg-slate-800">Oldest First</option>
                        </select>
                      </div>
                      <div className="text-center">
                        <Button 
                          className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark hover:from-dlsl-green-dark hover:to-dlsl-green sleek-shadow-xl hover:sleek-shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl px-8 py-4 text-white font-semibold text-lg border-0"
                          onClick={() => navigate('/login')}
                        >
                          <Search className="mr-3 h-5 w-5" />
                          Search Theses
                        </Button>
                        <p className="text-sm text-slate-400 mt-4 font-medium">Sign in to access full search features</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-6">Platform Features</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-dlsl-green to-dlsl-green-light mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-slate-300 leading-relaxed">Everything you need for academic research</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="glass-effect p-10 rounded-2xl sleek-shadow-xl border border-white/20 hover:sleek-shadow-2xl transition-all duration-300 animate-scale-in">
                <div className="w-16 h-16 bg-gradient-to-br from-dlsl-green/20 to-dlsl-green/30 rounded-2xl flex items-center justify-center mb-8 sleek-shadow-lg">
                  <Search className="h-8 w-8 text-dlsl-green" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">Advanced Search</h3>
                <p className="text-slate-300 leading-relaxed text-lg">Find relevant research quickly with our powerful search engine and intelligent filtering capabilities.</p>
              </div>
              
              <div className="glass-effect p-10 rounded-2xl sleek-shadow-xl border border-white/20 hover:sleek-shadow-2xl transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-dlsl-green/20 to-dlsl-green/30 rounded-2xl flex items-center justify-center mb-8 sleek-shadow-lg">
                  <FileText className="h-8 w-8 text-dlsl-green" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">Digital Library</h3>
                <p className="text-slate-300 leading-relaxed text-lg">Access and read theses directly in your browser with our advanced document viewer and management system.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-slide-up">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  Academic Research Management
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed">
                  STARS provides a comprehensive platform for managing and accessing academic research with modern tools and intuitive design.
                </p>
                
                <div className="space-y-6">
                  {[
                    'Intelligent search and categorization',
                    'Role-based access control',
                    'Department-specific organization',
                    'Secure cloud storage'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <CheckCircle2 className="h-6 w-6 text-dlsl-green mr-4 flex-shrink-0 mt-1" />
                      <p className="text-slate-300 text-lg leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="glass-effect p-12 rounded-3xl border border-white/20 sleek-shadow-2xl bg-gradient-to-br from-dlsl-green/10 to-dlsl-green-dark/20 animate-scale-in">
                <div className="aspect-square w-full bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <div className="text-center">
                    <Star className="h-32 w-32 text-dlsl-green mx-auto mb-6" />
                    <BarChart3 className="h-20 w-20 text-dlsl-green-light mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-dlsl-green/20 to-dlsl-green-dark/20 glass-effect border-t border-white/10 py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Ready to start exploring?</h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Join researchers and students in discovering academic work. Sign in to access the full repository with advanced search capabilities.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark hover:from-dlsl-green-dark hover:to-dlsl-green sleek-shadow-xl hover:sleek-shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl px-8 py-4 text-white font-semibold text-lg border-0"
                  onClick={() => navigate('/login')}
                >
                  <Star className="mr-3 h-6 w-6" />
                  Sign in to STARS
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="glass-effect border-white/30 text-white hover:bg-white/10 sleek-shadow-lg hover:sleek-shadow-xl transition-all duration-300 rounded-xl px-8 py-4 font-semibold text-lg"
                >
                  <Book className="mr-3 h-6 w-6" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

// ListItem component for navigation menu
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white glass-effect border border-white/10",
            className
          )}
          {...props}
        >
          <div className="text-sm font-semibold leading-none text-white">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-slate-300">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Index;
