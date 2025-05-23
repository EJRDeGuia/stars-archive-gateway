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
  const collegeData = [
    {
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
    }
  ];

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
      {/* Enhanced Background with Depth Effect */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(/lovable-uploads/83b8c064-b1bc-4c93-b353-78a1467e8d8d.png)`,
            filter: 'brightness(1.05) contrast(1.05)',
            transform: 'scale(1.1)'
          }}
        ></div>
        {/* First parallax layer - adds depth */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: `url(/lovable-uploads/83b8c064-b1bc-4c93-b353-78a1467e8d8d.png)`,
            filter: 'blur(12px) brightness(1.1)',
            transform: 'scale(1.2) translateY(2%)',
            mixBlendMode: 'overlay'
          }}
        ></div>
        {/* Subtle color tint and texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-green-700/20 mix-blend-soft-light"></div>
        <div className="absolute inset-0 bg-[url('data:image/png;base64,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')] mix-blend-color-burn opacity-10"></div>
        <div className="absolute inset-0 bg-black opacity-25"></div>
      </div>
      
      {/* Content Layer with Higher Z-Index */}
      <div className="relative z-30">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-white/30 relative z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-dlsl-green to-dlsl-green-dark rounded-lg flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-dlsl-green to-dlsl-green-dark bg-clip-text text-transparent">STARS</h1>
                  <p className="text-xs text-gray-500">De La Salle Lipa</p>
                </div>
              </div>
              
              <div className="hidden md:flex space-x-8">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>About</NavigationMenuTrigger>
                      <NavigationMenuContent className="z-50">
                        <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px]">
                          <li className="row-span-3">
                            <NavigationMenuLink asChild>
                              <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-dlsl-green/10 to-dlsl-green/20 p-6 no-underline outline-none focus:shadow-md" href="#">
                                <div className="mb-2 mt-4 text-lg font-medium">
                                  Smart Thesis Archival and Retrieval System
                                </div>
                                <p className="text-sm leading-tight text-muted-foreground">
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
                      <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                      <NavigationMenuContent className="z-50">
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
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Contact
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark hover:from-dlsl-green-dark hover:to-dlsl-green shadow-lg">
                Sign in
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section - Modified for better depth */}
        <section className="relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20 shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  De La Salle Lipa • Learning Resource Center
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
                    Smart Thesis
                    <span className="block">Archival and</span>
                    <span className="block">Retrieval System</span>
                  </h1>
                  <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                    A modern platform for managing, discovering, and accessing academic research at De La Salle Lipa.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-dlsl-green hover:bg-gray-100 shadow-lg" onClick={() => {
                    const searchSection = document.getElementById('search-section');
                    searchSection?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    <Search className="mr-2 h-5 w-5" />
                    Start Exploring
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-dlsl-green border-2" onClick={() => navigate('/login')}>
                    <Book className="mr-2 h-5 w-5" />
                    Login to Browse
                  </Button>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="relative backdrop-blur-sm">
                  <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                    <Star className="h-32 w-32 text-white/80" />
                  </div>
                  {/* Stats cards */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-dlsl-green to-dlsl-green-dark rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">500+ Theses</p>
                        <p className="text-sm text-gray-500">Available now</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-dlsl-green to-emerald-500 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">5 Colleges</p>
                        <p className="text-sm text-gray-500">Academic research</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section with improved glass effect */}
        <section id="search-section" className="py-16 bg-white/80 backdrop-blur-xl relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-dlsl-green mb-4">Find Academic Research</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-dlsl-green to-dlsl-green-dark mx-auto mb-4"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover undergraduate theses from all academic departments at De La Salle Lipa.
              </p>
            </div>

            <Tabs defaultValue="colleges" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="colleges" className="data-[state=active]:bg-dlsl-green data-[state=active]:text-white">Browse by College</TabsTrigger>
                <TabsTrigger value="search" className="data-[state=active]:bg-dlsl-green data-[state=active]:text-white">Advanced Search</TabsTrigger>
              </TabsList>
              
              <TabsContent value="colleges">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collegeData.map((college) => {
                    const colors = getCollegeColors(college.color);
                    return (
                      <Card 
                        key={college.name} 
                        className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white/90 backdrop-blur-sm" 
                        onClick={() => navigate(`/college/${college.id}`)}
                      >
                        <div className={`h-1 bg-gradient-to-r ${colors.gradient}`}></div>
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <div className={`${colors.bg} p-3 rounded-lg border ${colors.border}`}>
                              {college.icon}
                            </div>
                            <div className="ml-4">
                              <h3 className="font-semibold text-gray-900">{college.name}</h3>
                              <p className="text-sm text-gray-500">{college.fullName}</p>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">{college.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              <Book className="h-4 w-4 inline mr-1" />
                              {college.thesesCount}+ Theses
                            </span>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="search">
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input 
                          type="text" 
                          placeholder="Search by title, author, keywords..." 
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dlsl-green focus:border-dlsl-green" 
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dlsl-green">
                          <option value="">All Colleges</option>
                          {collegeData.map(college => (
                            <option key={college.id} value={college.id}>{college.name}</option>
                          ))}
                        </select>
                        <select className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dlsl-green">
                          <option value="">All Years</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                        </select>
                        <select className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dlsl-green">
                          <option value="relevance">Relevance</option>
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                        </select>
                      </div>
                      <div className="text-center">
                        <Button className="bg-dlsl-green hover:bg-dlsl-green-dark" onClick={() => navigate('/login')}>
                          <Search className="mr-2 h-5 w-5" />
                          Search Theses
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">Sign in to access full search features</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Features Section with improved glass effect */}
        <section className="py-16 bg-gray-50/80 backdrop-blur-xl relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-dlsl-green mb-4">Platform Features</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-dlsl-green to-dlsl-green-dark mx-auto mb-4"></div>
              <p className="text-xl text-gray-600">Everything you need for academic research</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-dlsl-green/10 rounded-lg flex items-center justify-center mb-6">
                  <Search className="h-6 w-6 text-dlsl-green" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Search</h3>
                <p className="text-gray-600">Find relevant research quickly with our powerful search engine and intelligent filtering.</p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-dlsl-green/10 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-dlsl-green" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Digital Library</h3>
                <p className="text-gray-600">Access and read theses directly in your browser with our document viewer.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-dlsl-green">
                  Academic Research Management
                </h2>
                <p className="text-lg text-gray-600">
                  STARS provides a comprehensive platform for managing and accessing academic research with modern tools and intuitive design.
                </p>
                
                <div className="space-y-4">
                  {[
                    'Intelligent search and categorization',
                    'Role-based access control',
                    'Research analytics and insights',
                    'Department-specific organization',
                    'Secure cloud storage',
                    'Collaborative tools'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle2 className="h-6 w-6 text-dlsl-green mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-dlsl-green/10 to-dlsl-green/20 p-8 rounded-2xl backdrop-blur-sm">
                <div className="aspect-square w-full bg-white/50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Star className="h-24 w-24 text-dlsl-green mx-auto mb-4" />
                    <BarChart3 className="h-16 w-16 text-dlsl-green mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-dlsl-green/90 to-dlsl-green-dark/90 backdrop-blur-sm text-white py-16 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Ready to start exploring?</h2>
              <p className="text-xl text-green-100 max-w-2xl mx-auto">
                Join researchers and students in discovering academic work. Sign in to access the full repository.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-white text-dlsl-green hover:bg-gray-100" onClick={() => navigate('/login')}>
                  <Star className="mr-2 h-5 w-5" />
                  Sign in to STARS
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-dlsl-green border-2">
                  <Book className="mr-2 h-5 w-5" />
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
const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(({
  className,
  title,
  children,
  ...props
}, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a 
          ref={ref} 
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", 
            className
          )} 
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Index;
