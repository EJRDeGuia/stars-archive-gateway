import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CollegeGrid from '@/components/dashboard/CollegeGrid';
import { 
  Heart, 
  FolderOpen, 
  Clock,
  Library as LibraryIcon,
  FileText,
  Eye,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getGreeting } from '@/utils/greetingUtils';
import { useRecentTheses } from '@/hooks/useRecentTheses';

const ResearcherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { recentTheses = [], isLoading: loadingRecent } = useRecentTheses();
  
  // Fetch user's favorites count
  const { data: favoritesCount = 0 } = useQuery({
    queryKey: ["favorites_count", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { count, error } = await supabase
        .from("user_favorites")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id,
  });

  // Fetch user's collections count
  const { data: collectionsCount = 0 } = useQuery({
    queryKey: ["user_collections_count", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { count, error } = await supabase
        .from("collections")
        .select("*", { count: 'exact', head: true })
        .eq("created_by", user.id);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id,
  });

  // Fetch total theses count
  const { data: totalTheses = 0 } = useQuery({
    queryKey: ["total_theses_count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("theses")
        .select("*", { count: 'exact', head: true })
        .eq("status", "approved");
      
      if (error) throw error;
      return count || 0;
    },
  });

  const quickActions = [
    {
      icon: FolderOpen,
      title: 'Collections',
      description: 'Curated research sets',
      onClick: () => navigate('/collections'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Heart,
      title: 'My Library',
      description: 'Saved favorites',
      onClick: () => navigate('/library'),
      color: 'from-red-500 to-red-600'
    }
  ];

  const stats = [
    {
      icon: LibraryIcon,
      label: 'My Library',
      value: favoritesCount,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => navigate('/library')
    },
    {
      icon: FolderOpen,
      label: 'Collections',
      value: collectionsCount,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      onClick: () => navigate('/collections')
    },
    {
      icon: FileText,
      label: 'Total Theses',
      value: totalTheses,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      onClick: () => navigate('/explore')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {getGreeting()}, {user?.name || 'Researcher'}!
            </h1>
            <p className="text-xl text-gray-600">
              Welcome to your research dashboard
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={stat.onClick}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center`}>
                      <stat.icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Explore Button */}
          <Card className="mb-12 bg-gradient-to-br from-dlsl-green to-emerald-600 text-white border-0 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/explore')}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-1">Explore Research</h2>
                    <p className="text-white/90 text-lg">Use AI-powered search to find theses</p>
                  </div>
                </div>
                <Button 
                  className="h-14 px-8 bg-white text-dlsl-green hover:bg-gray-100 text-lg font-semibold"
                  onClick={() => navigate('/explore')}
                >
                  Start Exploring →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={action.onClick}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-dlsl-green transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* College Cards Section */}
          <CollegeGrid />

          {/* Recent Theses */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Recently Added</h2>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/explore')}
              >
                View All
              </Button>
            </div>

            {loadingRecent ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : recentTheses.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No theses available yet
                  </h3>
                  <p className="text-gray-500">
                    Check back later for new research papers
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentTheses.map((thesis) => (
                  <Card 
                    key={thesis.id}
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/thesis/${thesis.id}`)}
                  >
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                        {thesis.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span className="font-medium">{thesis.author}</span>
                      </div>
                      {thesis.abstract && (
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {thesis.abstract}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{thesis.view_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {thesis.publish_date 
                                ? new Date(thesis.publish_date).getFullYear()
                                : 'N/A'
                              }
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {thesis.college_name || 'Unknown'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResearcherDashboard;