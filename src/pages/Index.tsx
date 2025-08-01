import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Book, CheckCircle2, Users, BarChart3, FileText, ChevronRight, Code, Calculator, Microscope, HeartPulse, UtensilsCrossed, Star, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CollegeCard from '@/components/CollegeCard';
import { useCollegesWithCounts } from '@/hooks/useCollegesWithCounts';

const Index = () => {
  const navigate = useNavigate();
  const { data: colleges = [], isLoading: collegesLoading } = useCollegesWithCounts();

  return <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background with Dotted Pattern and Increased Blur */}
      <div className="fixed inset-0 z-0">
        {/* Main background image with stronger blur */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md" style={{
        backgroundImage: `url(/lovable-uploads/83b8c064-b1bc-4c93-b353-78a1467e8d8d.png)`,
        filter: 'brightness(1.1) contrast(1.1)',
        transform: 'scale(1.1)'
      }}></div>
        
        {/* Dotted pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }}></div>
        
        {/* Secondary dotted pattern for depth */}
        <div className="absolute inset-0 opacity-15" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,100,0,0.3) 0.5px, transparent 0)`,
        backgroundSize: '12px 12px',
        backgroundPosition: '6px 6px'
      }}></div>
        
        {/* Geometric texture overlay */}
        <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 15px,
          rgba(255,255,255,0.1) 15px,
          rgba(255,255,255,0.1) 30px
        ),
        repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 15px,
          rgba(0,100,0,0.1) 15px,
          rgba(0,100,0,0.1) 30px
        )`
      }}></div>
        
        {/* Enhanced gradient overlays for better visual depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-green-700/20 to-emerald-800/25"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
        
        {/* Radial gradient for focus effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30"></div>
      </div>
      
      {/* Content Layer with Higher Z-Index */}
      <div className="relative z-30">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/40 relative z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-dlsl-green to-dlsl-green-dark rounded-lg flex items-center justify-center shadow-xl">
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
                              <a 
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-dlsl-green/10 to-dlsl-green/20 p-6 no-underline outline-none focus:shadow-md cursor-pointer" 
                                onClick={() => navigate('/about')}
                              >
                                <div className="mb-2 mt-4 text-lg font-medium">
                                  Smart Thesis Archival and Retrieval System
                                </div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                  STARS is a modern platform for storing, managing, and retrieving academic research at De La Salle Lipa.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          <ListItem onClick={() => navigate('/about')} title="Introduction">
                            Learn about the system and its features
                          </ListItem>
                          <ListItem onClick={() => navigate('/about')} title="How It Works">
                            Understand the thesis submission process
                          </ListItem>
                          <ListItem onClick={() => navigate('/about')} title="For Researchers">
                            Special features for academic researchers
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                      <NavigationMenuContent className="z-50">
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                          <ListItem onClick={() => navigate('/resources')} title="User Guide">
                            Step-by-step guides to using STARS
                          </ListItem>
                          <ListItem onClick={() => navigate('/resources')} title="Help Center">
                            FAQ and troubleshooting
                          </ListItem>
                          <ListItem onClick={() => navigate('/resources')} title="Research Standards">
                            Format and citation guidelines
                          </ListItem>
                          <ListItem onClick={() => navigate('/resources')} title="Contact Support">
                            Get help from the STARS team
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink 
                        className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                        onClick={() => navigate('/resources')}
                      >
                        Contact
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark hover:from-dlsl-green-dark hover:to-dlsl-green shadow-xl transition-all duration-300 hover:shadow-2xl">
                Sign in
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center backdrop-blur-xl px-6 py-3 rounded-full text-sm font-medium border border-white/30 shadow-2xl bg-[dlsl-green-dark] bg-transparent">
                  <Sparkles className="w-4 h-4 mr-2 text-white" />
                  <span className="text-white">De La Salle Lipa • Learning Resource Center</span>
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white drop-shadow-2xl">
                    Smart Thesis
                    <span className="block bg-gradient-to-r from-white to-green-100 bg-clip-text text-zinc-50">Archival and</span>
                    <span className="block bg-gradient-to-r from-green-100 to-white bg-clip-text text-transparent">Retrieval System</span>
                  </h1>
                  <p className="text-xl text-white/95 leading-relaxed max-w-lg drop-shadow-lg">
                    A modern platform for managing, discovering, and accessing academic research at De La Salle Lipa.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white/95 text-dlsl-green hover:bg-white shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105" onClick={() => {
                  const searchSection = document.getElementById('search-section');
                  searchSection?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }}>
                    <Search className="mr-2 h-5 w-5" />
                    Start Exploring
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="border-white/80 border-2 backdrop-blur-sm shadow-xl transition-all duration-300 bg-dlsl-green text-zinc-50">
                    <Book className="mr-2 h-5 w-5" />
                    Login to Browse
                  </Button>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="relative backdrop-blur-xl">
                  <div className="w-80 h-80 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-3xl bg-gradient-to-br from-dlsl-green/20 to-dlsl-green-dark/30 rounded-xl bg-inherit">
                    <Star className="h-32 w-32 text-white/90 drop-shadow-2xl" />
                  </div>
                  {/* Enhanced stats cards */}
                  <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl p-4 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-dlsl-green to-dlsl-green-dark rounded-full flex items-center justify-center shadow-lg">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">500+ Theses</p>
                        <p className="text-sm text-gray-500">Available now</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl p-4 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-dlsl-green to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
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

        {/* Search Section with enhanced glass effect */}
        <section id="search-section" className="py-16 bg-white/85 backdrop-blur-2xl relative z-20 border-t border-white/30">
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
                <div className="max-w-5xl mx-auto">
                  {/* Top row: first 3 colleges */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {collegesLoading ? (
                      <div className="col-span-3 text-center py-8 text-gray-400">Loading colleges...</div>
                    ) : (
                      colleges.slice(0, 3).map(college => (
                        <CollegeCard
                          key={college.id}
                          college={college}
                          onClick={() => navigate(`/college/${college.id}`)}
                        />
                      ))
                    )}
                  </div>

                  {/* Bottom row: next 2 colleges centered */}
                  {!collegesLoading && colleges.length > 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                      {colleges.slice(3, 5).map(college => (
                        <CollegeCard
                          key={college.id}
                          college={college}
                          onClick={() => navigate(`/college/${college.id}`)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="search">
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input type="text" placeholder="Search by title, author, keywords..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dlsl-green focus:border-dlsl-green" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dlsl-green">
                          <option value="">All Colleges</option>
                          {colleges.map(college => <option key={college.id} value={college.id}>{college.name}</option>)}
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

        {/* Features Section with enhanced glass effect */}
        <section className="py-16 bg-gray-50/85 backdrop-blur-2xl relative z-20 border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-dlsl-green mb-4">Platform Features</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-dlsl-green to-dlsl-green-dark mx-auto mb-4"></div>
              <p className="text-xl text-gray-600">Everything you need for academic research</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                <div className="w-12 h-12 bg-dlsl-green/10 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <Search className="h-6 w-6 text-dlsl-green" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Search</h3>
                <p className="text-gray-600">Find relevant research quickly with our powerful search engine and intelligent filtering.</p>
              </div>
              
              <div className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                <div className="w-12 h-12 bg-dlsl-green/10 rounded-xl flex items-center justify-center mb-6 shadow-lg">
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
                  {['Intelligent search and categorization', 'Role-based access control', 'Department-specific organization', 'Secure cloud storage'].map((feature, index) => <div key={index} className="flex items-start">
                      <CheckCircle2 className="h-6 w-6 text-dlsl-green mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600">{feature}</p>
                    </div>)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-dlsl-green/15 to-dlsl-green/25 p-8 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="aspect-square w-full bg-white/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <Star className="h-24 w-24 text-dlsl-green mx-auto mb-4 drop-shadow-lg" />
                    <BarChart3 className="h-16 w-16 text-dlsl-green mx-auto drop-shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Made transparent to show background */}
        <section className="bg-gradient-to-r from-dlsl-green/60 to-dlsl-green-dark/60 backdrop-blur-md text-white py-16 relative z-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold drop-shadow-lg">Ready to start exploring?</h2>
              <p className="text-xl text-green-100 max-w-2xl mx-auto drop-shadow-md">
                Join researchers and students in discovering academic work. Sign in to access the full repository.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-white/95 text-dlsl-green hover:bg-white shadow-2xl transition-all duration-300 hover:scale-105" onClick={() => navigate('/login')}>
                  <Star className="mr-2 h-5 w-5" />
                  Sign in to STARS
                </Button>
                <Button size="lg" variant="outline" className="border-white/80 border-2 backdrop-blur-sm shadow-xl transition-all duration-300 bg-zinc-50 text-dlsl-green">
                  <Book className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>;
};

// ListItem component for navigation menu
const ListItem = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div"> & { title: string; onClick?: () => void }>(({
  className,
  title,
  children,
  onClick,
  ...props
}, ref) => {
  return <li>
    <NavigationMenuLink asChild>
      <div 
        ref={ref} 
        className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer", className)} 
        onClick={onClick}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </div>
    </NavigationMenuLink>
  </li>;
});
ListItem.displayName = "ListItem";
export default Index;