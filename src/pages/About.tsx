
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Star, Book, Users, Target, Shield, Zap, Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSystemStats } from '@/hooks/useSystemStats';
import { useAboutContent, useTeamMembers } from '@/hooks/useAboutContent';

const About = () => {
  const navigate = useNavigate();
  const { data: systemStats, isLoading: statsLoading } = useSystemStats();
  const { data: aboutContent, isLoading: contentLoading } = useAboutContent();
  const { data: teamMembers, isLoading: teamLoading } = useTeamMembers();

  const features = [
    {
      icon: <Book className="h-8 w-8" />,
      title: "Digital Repository",
      description: "Comprehensive collection of undergraduate and graduate theses from all academic departments."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Advanced Search",
      description: "Powerful search engine with intelligent filtering and keyword-based discovery."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Access",
      description: "Role-based access control ensuring academic integrity and proper permissions."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Driven",
      description: "Built for students, researchers, and faculty to collaborate and share knowledge."
    }
  ];

  // Dynamic stats from database
  const stats = systemStats ? [
    { number: systemStats.total_theses?.value.toString() || "0", label: systemStats.total_theses?.label || "Theses Available" },
    { number: systemStats.total_colleges?.value.toString() || "0", label: systemStats.total_colleges?.label || "Academic Colleges" },
    { number: systemStats.active_users?.value.toString() || "0", label: systemStats.active_users?.label || "Active Users" },
    { number: "99%", label: "Uptime" }
  ] : [];

  if (statsLoading || contentLoading || teamLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-dlsl-green" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
              className="mb-8 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
            </Button>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-dlsl-green/10 rounded-2xl mb-8">
                <Star className="w-10 h-10 text-dlsl-green" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">About STARS</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Smart Thesis Archival and Retrieval System - Empowering academic research at De La Salle Lipa
              </p>
            </div>
          </div>

          {/* Dynamic Content Sections */}
          {aboutContent && aboutContent.length > 0 && (
            <div className="mb-16 space-y-8">
              {aboutContent.map((content) => (
                <Card key={content.id} className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="p-12">
                    <div className="text-center mb-8">
                      <Target className="w-16 h-16 text-dlsl-green mx-auto mb-6" />
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h2>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                      {content.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-dlsl-green/10 rounded-2xl flex items-center justify-center mb-6 text-dlsl-green">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Dynamic Stats Section */}
          {stats.length > 0 && (
            <div className="mb-16">
              <Card className="bg-dlsl-green text-white">
                <CardContent className="p-12">
                  <h2 className="text-3xl font-bold text-center mb-12">By the Numbers</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-4xl font-bold mb-2">{stat.number}</div>
                        <div className="text-green-100">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Team Section */}
          {teamMembers && teamMembers.length > 0 && (
            <div className="mb-16">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-12">
                  <div className="text-center mb-12">
                    <Users className="w-16 h-16 text-dlsl-green mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
                    <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8">
                      STARS is developed and maintained by dedicated professionals committed to academic excellence and innovation.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="text-center">
                        <div className="w-20 h-20 bg-dlsl-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-10 h-10 text-dlsl-green" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                        <p className="text-dlsl-green font-medium mb-3">{member.role}</p>
                        {member.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      onClick={() => navigate('/login')}
                      className="bg-dlsl-green hover:bg-dlsl-green-dark text-white px-8 py-4 rounded-xl"
                    >
                      Get Started with STARS
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Fallback Team Section if no data */}
          {(!teamMembers || teamMembers.length === 0) && (
            <div className="mb-16">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-12 text-center">
                  <Heart className="w-16 h-16 text-dlsl-green mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Built with Care</h2>
                  <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8">
                    STARS is developed and maintained by the Learning Resource Center at De La Salle Lipa, 
                    in collaboration with the IT department and academic faculty. Our commitment is to provide 
                    a reliable, user-friendly platform that serves the entire academic community.
                  </p>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="bg-dlsl-green hover:bg-dlsl-green-dark text-white px-8 py-4 rounded-xl"
                  >
                    Get Started with STARS
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
