
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Search, Book, Building, CheckCircle2, Users, BarChart3, FileText, ChevronRight, Code, Calculator, Microscope, HeartPulse, UtensilsCrossed, Star, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
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
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Enhanced Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(/lovable-uploads/fd7995a2-1df9-4aeb-bbfb-6a33723b9835.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Enhanced Background Overlay with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-white/40 via-white/20 to-dlsl-green/10 backdrop-blur-[1px] z-10"></div>
      
      {/* Content with relative positioning */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Enhanced Header */}
        <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-dlsl-green to-dlsl-green-dark rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-7 h-7 text-white fill-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-dlsl-green to-dlsl-green-dark bg-clip-text text-transparent">STARS</h1>
                  <p className="text-xs text-gray-500 font-medium">De La Salle Lipa</p>
                </div>
              </div>
              
              <div className="hidden md:flex space-x-4">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-white/50">About</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px]">
                          <li className="row-span-3">
                            <NavigationMenuLink asChild>
                              <a className="flex h-full w-full select-none flex-col justify-end rounded-xl bg-gradient-to-br from-dlsl-green/20 to-dlsl-green/40 p-6 no-underline outline-none focus:shadow-md hover:shadow-lg transition-all" href="#">
                                <div className="mt-4 mb-2 text-lg font-bold text-dlsl-green">
                                  Smart Thesis Archival and Retrieval System
                                </div>
                                <p className="text-sm leading-tight text-dlsl-green/90 font-medium">
                                  STARS is a modern platform designed to store, manage, and retrieve academic research and theses at De La Salle Lipa.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          <ListItem href="#" title="Introduction">
                            Learn about the system and its features
                          </ListItem>
                          <ListItem href="#" title="How It Works">
                            Understand the thesis submission and retrieval process
                          </ListItem>
                          <ListItem href="#" title="For Researchers">
                            Special features for academic researchers
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-white/50">Resources</NavigationMenuTrigger>
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

              <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 px-6 py-2.5">
                Sign in
              </Button>
            </div>
          </div>
        </header>

        {/* Enhanced Hero Section */}
        <div className="bg-white/80 backdrop-blur-md py-20 md:py-32 border-b border-white/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="text-left space-y-8">
                <div className="inline-flex items-center bg-gradient-to-r from-dlsl-green/10 to-dlsl-green/20 backdrop-blur-sm px-6 py-3 rounded-full text-dlsl-green font-semibold text-sm border border-dlsl-green/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  De La Salle Lipa • Learning Resource Center
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                  Smart Thesis 
                  <span className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark bg-clip-text text-transparent block">
                    Archival
                  </span>
                  and{' '}
                  <span className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark bg-clip-text text-transparent">
                    Retrieval
                  </span>
                  <br />System
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  A cutting-edge platform for managing, discovering, and accessing academic research
                  at De La Salle Lipa with AI-powered insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark text-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg" onClick={() => {
                  const searchSection = document.getElementById('search-section');
                  searchSection?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }}>
                    <Search className="mr-2 h-5 w-5" />
                    Start Exploring
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-dlsl-green text-dlsl-green hover:bg-dlsl-green hover:text-white transition-all duration-300 px-8 py-4 text-lg backdrop-blur-sm bg-white/50" onClick={() => navigate('/login')}>
                    <Book className="mr-2 h-5 w-5" />
                    Login to Browse
                  </Button>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="relative">
                  <div className="w-96 h-96 bg-gradient-to-br from-dlsl-green/20 to-dlsl-green/40 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl">
                    <Star className="h-48 w-48 text-dlsl-green fill-dlsl-green/30" />
                  </div>
                  {/* Floating cards */}
                  <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 transform rotate-3 hover:rotate-0 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-dlsl-gold to-yellow-500 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">500+ Theses</p>
                        <p className="text-sm text-gray-500">Available now</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 transform -rotate-3 hover:rotate-0 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-dlsl-green to-emerald-500 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">5 Colleges</p>
                        <p className="text-sm text-gray-500">Academic research</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 -left-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-white/20">
                    <TrendingUp className="h-8 w-8 text-dlsl-green" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Section */}
        <section id="search-section" className="py-20 bg-white/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-dlsl-green flex items-center justify-center mb-4">
                <Search className="mr-3 h-8 w-8" />
                Find Academic Research
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-dlsl-gold to-yellow-500 mx-auto rounded-full"></div>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover groundbreaking undergraduate theses from all academic departments at De La Salle Lipa.
                Browse by college or use our advanced search to find specific research.
              </p>
            </div>

            <Tabs defaultValue="colleges" className="w-full max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-12 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/20">
                <TabsTrigger value="colleges" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-dlsl-green data-[state=active]:to-dlsl-green-dark data-[state=active]:text-white py-3 px-6 font-semibold">Browse by College</TabsTrigger>
                <TabsTrigger value="search" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-dlsl-green data-[state=active]:to-dlsl-green-dark data-[state=active]:text-white py-3 px-6 font-semibold">Advanced Search</TabsTrigger>
              </TabsList>
              <TabsContent value="colleges" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {collegeData.map((college, index) => {
                    const colors = getCollegeColors(college.color);
                    return (
                      <Card 
                        key={college.name} 
                        className={`group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${colors.hover} bg-white/90 backdrop-blur-md`} 
                        onClick={() => navigate(`/college/${college.id}`)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>
                        <CardContent className="p-8">
                          <div className="flex items-center mb-6">
                            <div className={`${colors.bg} p-4 rounded-2xl border ${colors.border} group-hover:scale-110 transition-transform duration-300`}>
                              <div className={`bg-gradient-to-br ${colors.gradient} text-white p-3 rounded-xl shadow-lg`}>
                                {college.icon}
                              </div>
                            </div>
                            <div className="ml-6">
                              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-dlsl-green transition-colors">{college.name}</h3>
                              <p className="text-sm text-gray-600 font-medium mt-1">{college.fullName}</p>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-6 leading-relaxed">{college.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mb-6">
                            <Book className="h-5 w-5 mr-2" />
                            <span className="font-semibold">{college.thesesCount}+ Theses Available</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Button variant="link" className={`${colors.text} pl-0 hover:underline font-semibold group-hover:translate-x-1 transition-transform`}>
                              Explore research
                            </Button>
                            <ChevronRight className={`h-6 w-6 ${colors.text} group-hover:translate-x-1 transition-transform`} />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
              <TabsContent value="search">
                <Card className="bg-white/90 backdrop-blur-md shadow-2xl border-0">
                  <CardContent className="pt-8 p-8">
                    <div className="space-y-8">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                        <input 
                          type="text" 
                          placeholder="Search by title, author, keywords, or research topic..." 
                          className="w-full pl-14 pr-6 py-4 text-lg bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-dlsl-green/20 focus:border-dlsl-green transition-all duration-300 shadow-lg" 
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">College</label>
                          <select className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-dlsl-green/20 focus:border-dlsl-green transition-all duration-300 shadow-lg">
                            <option value="">All Colleges</option>
                            <option value="cite">CITE</option>
                            <option value="cbeam">CBEAM</option>
                            <option value="ceas">CEAS</option>
                            <option value="con">CON</option>
                            <option value="cihtm">CIHTM</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">Year</label>
                          <select className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-dlsl-green/20 focus:border-dlsl-green transition-all duration-300 shadow-lg">
                            <option value="">All Years</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">Sort By</label>
                          <select className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-dlsl-green/20 focus:border-dlsl-green transition-all duration-300 shadow-lg">
                            <option value="relevance">Relevance</option>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="title">Title (A-Z)</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col items-center space-y-4">
                        <Button className="bg-gradient-to-r from-dlsl-green to-dlsl-green-dark text-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 px-12 py-4 text-lg rounded-2xl" onClick={() => navigate('/login')}>
                          <Search className="mr-3 h-6 w-6" />
                          Search Theses
                          <ArrowRight className="ml-3 h-6 w-6" />
                        </Button>
                        <p className="text-center text-sm text-gray-500 font-medium">Sign in to access advanced search features and full thesis content</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-20 bg-white/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-dlsl-green flex items-center justify-center mb-4">
                <Sparkles className="mr-3 h-8 w-8" />
                Platform Features
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-dlsl-gold to-yellow-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
              <div className="group bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-dlsl-green/20 to-dlsl-green/40 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-8 w-8 text-dlsl-green" />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-gray-800">Advanced Search & AI</h3>
                <p className="text-gray-600 leading-relaxed text-lg">Find relevant research quickly with our AI-powered search engine, semantic analysis, and intelligent filtering options.</p>
              </div>
              
              <div className="group bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/40 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-gray-800">Interactive Reading</h3>
                <p className="text-gray-600 leading-relaxed text-lg">Access and read theses directly in your browser with our enhanced document viewer and annotation tools.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-dlsl-green leading-tight">
                  Next-Generation Academic Research Management
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  STARS revolutionizes how academic research is managed and accessed through cutting-edge technology,
                  AI-powered insights, and intuitive design. Experience the future of academic archival systems.
                </p>
                
                <div className="space-y-6">
                  {[
                    'AI-powered semantic search and thesis summarization',
                    'Role-based access control for students, faculty, and administrators',
                    'Advanced analytics and research trend insights',
                    'Department-specific organization and categorization',
                    'Secure cloud storage with automated backups',
                    'Real-time collaboration and annotation tools'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start group">
                      <CheckCircle2 className="h-7 w-7 text-dlsl-green mr-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <p className="text-gray-600 text-lg leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-dlsl-green/10 to-dlsl-green/20 p-12 rounded-3xl backdrop-blur-sm border border-white/20">
                <div className="aspect-square w-full bg-gradient-to-br from-dlsl-green/20 to-dlsl-green/40 rounded-3xl flex items-center justify-center relative overflow-hidden">
                  <Star className="h-32 w-32 text-dlsl-green fill-dlsl-green/30" />
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-white/20 animate-bounce">
                    <FileText className="h-8 w-8 text-dlsl-green" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-white/20 animate-pulse">
                    <Search className="h-8 w-8 text-dlsl-green" />
                  </div>
                  <div className="absolute top-1/4 -left-6 bg-white/90 backdrop-blur-md rounded-full shadow-xl p-3 border border-white/20">
                    <BarChart3 className="h-6 w-6 text-dlsl-green" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-r from-dlsl-green via-dlsl-green-dark to-dlsl-green backdrop-blur-md text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="space-y-8">
              <h2 className="text-5xl font-bold mb-6">Ready to start exploring?</h2>
              <p className="text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Join thousands of researchers and students in discovering groundbreaking academic work.
                Sign in to access the full repository of theses and research papers.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
                <Button size="lg" className="bg-white text-dlsl-green hover:bg-gray-100 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-12 py-6 text-xl rounded-2xl font-bold" onClick={() => navigate('/login')}>
                  <Star className="mr-3 h-6 w-6" />
                  Sign in to STARS
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-dlsl-green transition-all duration-300 px-12 py-6 text-xl rounded-2xl font-bold backdrop-blur-sm">
                  <Book className="mr-3 h-6 w-6" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

// Enhanced ListItem component for navigation menu
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
            "block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-all hover:bg-white/80 hover:shadow-lg focus:bg-white/80 focus:shadow-lg backdrop-blur-sm", 
            className
          )} 
          {...props}
        >
          <div className="text-sm font-bold leading-none text-dlsl-green">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-2">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Index;
