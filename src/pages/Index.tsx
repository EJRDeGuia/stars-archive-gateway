
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  GraduationCap, 
  Search, 
  Book, 
  Building, 
  CheckCircle2,
  Users,
  BarChart3,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const navigate = useNavigate();

  const collegeData = [
    { 
      id: '1',
      name: 'CITE', 
      fullName: 'College of Information Technology and Engineering',
      color: 'red',
      thesesCount: 120
    },
    { 
      id: '2',
      name: 'CBEAM', 
      fullName: 'College of Business, Economics, Accountancy, and Management',
      color: 'yellow',
      thesesCount: 145
    },
    { 
      id: '3',
      name: 'CEAS', 
      fullName: 'College of Education, Arts, and Sciences',
      color: 'blue',
      thesesCount: 98
    },
    { 
      id: '4',
      name: 'CON', 
      fullName: 'College of Nursing',
      color: 'gray',
      thesesCount: 76
    },
    { 
      id: '5',
      name: 'CIHTM', 
      fullName: 'College of International Hospitality and Tourism Management',
      color: 'green',
      thesesCount: 110
    }
  ];

  const getCollegeColors = (color: string) => {
    switch (color) {
      case 'red': return {
        bg: 'bg-red-100',
        icon: 'bg-red-500',
        border: 'border-red-500',
        text: 'text-red-500',
        hover: 'hover:bg-red-50'
      };
      case 'yellow': return {
        bg: 'bg-yellow-100',
        icon: 'bg-yellow-500',
        border: 'border-yellow-500',
        text: 'text-yellow-600',
        hover: 'hover:bg-yellow-50'
      };
      case 'blue': return {
        bg: 'bg-blue-100',
        icon: 'bg-blue-500',
        border: 'border-blue-500',
        text: 'text-blue-500',
        hover: 'hover:bg-blue-50'
      };
      case 'green': return {
        bg: 'bg-green-100',
        icon: 'bg-green-500',
        border: 'border-green-500',
        text: 'text-green-500',
        hover: 'hover:bg-green-50'
      };
      default: return {
        bg: 'bg-gray-100',
        icon: 'bg-gray-500',
        border: 'border-gray-500',
        text: 'text-gray-500',
        hover: 'hover:bg-gray-50'
      };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-6 h-6 text-dlsl-green" />
              <h1 className="text-xl font-bold text-dlsl-green">STARS</h1>
            </div>
            
            <div className="hidden md:flex space-x-4">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">About</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-dlsl-green/20 to-dlsl-green/50 p-6 no-underline outline-none focus:shadow-md"
                              href="#"
                            >
                              <div className="mt-4 mb-2 text-lg font-medium text-dlsl-green">
                                Smart Thesis Archival and Retrieval System
                              </div>
                              <p className="text-sm leading-tight text-dlsl-green/90">
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
                    <NavigationMenuTrigger className="bg-transparent">Resources</NavigationMenuTrigger>
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

            <Button 
              onClick={() => navigate('/login')}
              className="bg-dlsl-green text-white hover:bg-dlsl-green-dark"
            >
              Sign in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-white py-16 md:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-block bg-dlsl-green/10 px-4 py-2 rounded-full text-dlsl-green font-medium text-sm mb-4">
                De La Salle Lipa • Learning Resource Center
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Smart Thesis <span className="text-dlsl-green">Archival</span> and <br /><span className="text-dlsl-green">Retrieval</span> System
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                A modern platform for managing, discovering, and accessing academic research
                at De La Salle Lipa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-dlsl-green text-white hover:bg-dlsl-green-dark"
                  onClick={() => {
                    const searchSection = document.getElementById('search-section');
                    searchSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Start Searching
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-dlsl-green text-dlsl-green hover:bg-dlsl-green/10"
                  onClick={() => navigate('/login')}
                >
                  <Book className="mr-2 h-5 w-5" />
                  Login to Browse
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-dlsl-green/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-32 w-32 text-dlsl-green opacity-40" />
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-md p-4 border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-dlsl-gold rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-dlsl-green" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">500+ Theses</p>
                      <p className="text-xs text-gray-500">Available now</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-md p-4 border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-dlsl-gold rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-dlsl-green" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">5 Colleges</p>
                      <p className="text-xs text-gray-500">Academic research</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <section id="search-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dlsl-green flex items-center justify-center">
              <Search className="mr-2 h-6 w-6" />
              Find Academic Research
            </h2>
            <div className="mt-2 w-16 h-1 bg-dlsl-gold mx-auto"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Discover undergraduate theses from all academic departments at De La Salle Lipa.
              Browse by college or use our advanced search to find specific research.
            </p>
          </div>

          <Tabs defaultValue="colleges" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="colleges">Browse by College</TabsTrigger>
              <TabsTrigger value="search">Advanced Search</TabsTrigger>
            </TabsList>
            <TabsContent value="colleges" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collegeData.map((college) => {
                  const colors = getCollegeColors(college.color);
                  return (
                    <Card 
                      key={college.name} 
                      className={`overflow-hidden border-t-4 ${colors.border} hover:shadow-lg transition-all ${colors.hover} cursor-pointer`}
                      onClick={() => navigate(`/college/${college.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className={`${colors.bg} p-3 rounded-full`}>
                            <div className={`${colors.icon} text-white p-2 rounded-full`}>
                              <Building className="h-6 w-6" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-xl font-bold text-gray-800">{college.name}</h3>
                            <p className="text-sm text-gray-600">{college.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Book className="h-4 w-4 mr-1" />
                          <span>{college.thesesCount}+ Theses</span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <Button 
                            variant="link" 
                            className={`${colors.text} pl-0 hover:underline`}
                          >
                            Explore theses
                          </Button>
                          <ChevronRight className={`h-5 w-5 ${colors.text}`} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="search">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search by title, author, keywords..."
                        className="w-full pl-10 pr-4 py-3 text-md bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dlsl-green focus:border-dlsl-green"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                        <select className="w-full p-2 bg-white border border-gray-300 rounded-md">
                          <option value="">All Colleges</option>
                          <option value="cite">CITE</option>
                          <option value="cbeam">CBEAM</option>
                          <option value="ceas">CEAS</option>
                          <option value="con">CON</option>
                          <option value="cihtm">CIHTM</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <select className="w-full p-2 bg-white border border-gray-300 rounded-md">
                          <option value="">All Years</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                          <option value="2021">2021</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <select className="w-full p-2 bg-white border border-gray-300 rounded-md">
                          <option value="relevance">Relevance</option>
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="title">Title (A-Z)</option>
                        </select>
                      </div>
                    </div>
                    <Button 
                      className="bg-dlsl-green text-white hover:bg-dlsl-green-dark w-full md:w-auto"
                      onClick={() => navigate('/login')}
                    >
                      <Search className="mr-2 h-5 w-5" />
                      Search Theses
                    </Button>
                    <p className="text-center text-sm text-gray-500">Sign in to access advanced search features</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dlsl-green flex items-center justify-center">
              <FileText className="mr-2 h-6 w-6" />
              Features
            </h2>
            <div className="mt-2 w-16 h-1 bg-dlsl-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-dlsl-green/10 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-dlsl-green" />
              </div>
              <h3 className="font-bold text-xl mb-2">Advanced Search</h3>
              <p className="text-gray-600">Find relevant research quickly with our powerful search engine and filtering options.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-dlsl-green/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-dlsl-green" />
              </div>
              <h3 className="font-bold text-xl mb-2">Online Reading</h3>
              <p className="text-gray-600">Access and read theses directly in your browser with our built-in document viewer.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-dlsl-green/10 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-dlsl-green" />
              </div>
              <h3 className="font-bold text-xl mb-2">Research Analytics</h3>
              <p className="text-gray-600">Gain insights into research trends and popular topics across the university.</p>
            </div>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-dlsl-green mb-6">
                  Advanced Thesis Management
                </h2>
                <p className="text-gray-600 mb-8">
                  STARS provides a comprehensive solution for thesis archival, retrieval, and
                  management. With advanced search capabilities, AI-powered insights, and secure
                  access controls, STARS transforms how academic research is managed and accessed.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-dlsl-green mr-3 flex-shrink-0" />
                    <p className="text-gray-600">Role-based access control for students, faculty, and administrators</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-dlsl-green mr-3 flex-shrink-0" />
                    <p className="text-gray-600">AI-powered semantic search and thesis summarization</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-dlsl-green mr-3 flex-shrink-0" />
                    <p className="text-gray-600">Department-specific organization and categorization</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-dlsl-green mr-3 flex-shrink-0" />
                    <p className="text-gray-600">Secure document storage and retrieval</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-dlsl-green mr-3 flex-shrink-0" />
                    <p className="text-gray-600">Analytics and reporting for research trends</p>
                  </div>
                </div>
              </div>
              <div className="bg-dlsl-green/5 p-8 rounded-lg">
                <div className="aspect-square w-full bg-dlsl-green/10 rounded-lg flex items-center justify-center relative">
                  <Book className="h-24 w-24 text-dlsl-green opacity-40" />
                  <div className="absolute -top-4 -right-4 bg-white rounded-full shadow-lg p-3">
                    <FileText className="h-6 w-6 text-dlsl-green" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-full shadow-lg p-3">
                    <Search className="h-6 w-6 text-dlsl-green" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-dlsl-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start exploring?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Sign in to access the full repository of academic theses and research papers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              className="bg-white text-dlsl-green hover:bg-gray-100"
              onClick={() => navigate('/login')}
            >
              Sign in to STARS
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
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
  )
})
ListItem.displayName = "ListItem"

export default Index;
