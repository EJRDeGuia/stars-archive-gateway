
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
    <div className="min-h-screen relative">
      {/* Campus Background Image with Blur and Depth */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(/lovable-uploads/83b8c064-b1bc-4c93-b353-78a1467e8d8d.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Multi-layered Overlay for Depth */}
      <div className="fixed inset-0 bg-gradient-to-br from-dlsl-green/20 via-white/60 to-dlsl-green/30 z-10"></div>
      <div className="fixed inset-0 bg-gradient-to-t from-dlsl-green/40 via-transparent to-white/20 z-20"></div>
      
      {/* Content Layer */}
      <div className="relative z-30">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-white/30">
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
                      <NavigationMenuContent>
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
                      <NavigationMenuContent>
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

        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-dlsl-green/90 via-dlsl-green to-dlsl-green-dark text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  De La Salle Lipa • Learning Resource Center
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Smart Thesis
                    <span className="block text-white">Archival and</span>
                    <span className="block">Retrieval System</span>
                  </h1>
                  <p className="text-xl text-green-100 leading-relaxed max-w-lg">
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
                <div className="relative">
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

        {/* Search Section */}
        <section id="search-section" className="py-16 bg-white/90 backdrop-blur-md">
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

        {/* Features Section */}
        <section className="py-16 bg-gray-50/90 backdrop-blur-md">
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
        <section className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark text-white py-16">
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
