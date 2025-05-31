
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  BookOpen,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Play,
  Star,
  Calendar,
  User
} from 'lucide-react';
import { colleges, theses } from '@/data/mockData';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCollegeClick = (collegeId: string) => {
    navigate(`/college/${collegeId}`);
  };

  const handleThesisClick = (thesisId: string) => {
    navigate(`/thesis/${thesisId}`);
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleExploreLibrary = () => {
    navigate('/login');
  };

  const stats = [
    { icon: BookOpen, value: '2,500+', label: 'Research Papers' },
    { icon: Users, value: '1,200+', label: 'Active Researchers' },
    { icon: TrendingUp, value: '95%', label: 'Success Rate' },
    { icon: Award, value: '5', label: 'Colleges' }
  ];

  const features = [
    {
      title: 'Advanced Search',
      description: 'Find exactly what you need with our powerful semantic search engine',
      icon: Search
    },
    {
      title: 'Comprehensive Collection',
      description: 'Access thousands of research papers from all DLSL colleges',
      icon: BookOpen
    },
    {
      title: 'Expert Community',
      description: 'Connect with researchers and academic professionals',
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-dlsl-green via-dlsl-green/90 to-dlsl-green/80 text-white py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-4xl">
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                Discover Academic
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200">
                  Excellence
                </span>
              </h1>
              <p className="text-xl lg:text-2xl mb-12 text-gray-100 leading-relaxed">
                Explore groundbreaking research from De La Salle Lipa's premier academic institutions. 
                Access thousands of thesis papers and connect with brilliant minds.
              </p>
              
              {/* Search Bar */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-12 border border-white/20">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for research papers, authors, or topics..."
                      className="bg-white/20 border-white/30 text-white placeholder-gray-200 h-14 text-lg focus:bg-white/30 transition-all"
                    />
                  </div>
                  <Button 
                    className="bg-white text-dlsl-green hover:bg-gray-100 h-14 px-8 font-semibold"
                    onClick={handleExploreLibrary}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  size="lg" 
                  className="bg-white text-dlsl-green hover:bg-gray-100 h-14 px-8 font-semibold"
                  onClick={handleGetStarted}
                >
                  Get Started
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 h-14 px-8 font-semibold"
                  onClick={handleExploreLibrary}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Explore Library
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-dlsl-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-dlsl-green" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Colleges Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Explore Our Colleges
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover research from our five distinguished colleges, each contributing 
                unique perspectives to academic excellence.
              </p>
            </div>
            
            {/* Custom grid layout for college cards */}
            <div className="max-w-6xl mx-auto">
              {/* Top row: CITE, CBEAM, CEAS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <CollegeCard
                  key={colleges[0].id}
                  college={colleges[0]}
                  onClick={() => handleCollegeClick(colleges[0].id)}
                  size="large"
                />
                <CollegeCard
                  key={colleges[1].id}
                  college={colleges[1]}
                  onClick={() => handleCollegeClick(colleges[1].id)}
                  size="large"
                />
                <CollegeCard
                  key={colleges[2].id}
                  college={colleges[2]}
                  onClick={() => handleCollegeClick(colleges[2].id)}
                  size="large"
                />
              </div>
              
              {/* Bottom row: CON and CIHTM positioned in middle */}
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                <div className="lg:col-start-2 lg:col-span-2">
                  <CollegeCard
                    key={colleges[3].id}
                    college={colleges[3]}
                    onClick={() => handleCollegeClick(colleges[3].id)}
                    size="large"
                  />
                </div>
                <div className="lg:col-start-4 lg:col-span-2">
                  <CollegeCard
                    key={colleges[4].id}
                    college={colleges[4]}
                    onClick={() => handleCollegeClick(colleges[4].id)}
                    size="large"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built for researchers, by researchers. Our platform offers the tools 
                and resources you need for academic success.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-dlsl-green/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <feature.icon className="w-10 h-10 text-dlsl-green" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Research Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Latest Research
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the most recent contributions to academic knowledge from our community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {theses.slice(0, 3).map((thesis) => (
                <Card 
                  key={thesis.id} 
                  className="hover:shadow-xl transition-all duration-500 cursor-pointer border-0 bg-white group"
                  onClick={() => handleThesisClick(thesis.id)}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="w-5 h-5 text-dlsl-green" />
                      <Badge variant="secondary" className="bg-dlsl-green/10 text-dlsl-green border-0">
                        {thesis.college}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-dlsl-green transition-colors line-clamp-2">
                      {thesis.title}
                    </h3>
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{thesis.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{thesis.year}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {thesis.abstract}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button 
                size="lg" 
                className="bg-dlsl-green hover:bg-dlsl-green/90 text-white"
                onClick={handleExploreLibrary}
              >
                View All Research
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-dlsl-green text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Explore?
            </h2>
            <p className="text-xl mb-12 text-gray-100 max-w-3xl mx-auto">
              Join our community of researchers and unlock access to thousands of academic papers.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-dlsl-green hover:bg-gray-100 h-14 px-8 font-semibold"
              onClick={handleGetStarted}
            >
              Get Started Today
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
