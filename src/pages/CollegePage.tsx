
import React, { useState, useEffect } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Calendar, TrendingUp, ArrowLeft, Search, Filter, Grid, List } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTheses } from "@/hooks/useApi";
import type { Thesis } from "@/types/thesis";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ChatSearch from "@/components/ChatSearch";
import FavoriteButton from "@/components/FavoriteButton";
import { useAuth } from "@/contexts/AuthContext";
import { useUserFavorites } from "@/hooks/useApi";

// College image mapping
const collegeImages: Record<string, string> = {
  'CITE': '/lovable-uploads/6bf09977-6df4-4933-bfc8-34fd6f51a931.png',
  'CBEAM': '/lovable-uploads/563b3ad8-1ee8-4770-9de8-b9a1383c9ec6.png',
  'CEAS': '/lovable-uploads/f2244dbc-5d8a-4c9f-8a64-4aec1893ad30.png',
  'CIHTM': '/lovable-uploads/468c9af5-ab3b-4867-95f9-8dd1c72176c5.png',
  'NURSING': '/lovable-uploads/cc51f057-9aa5-4894-8fef-9cd1eb9df743.png',
  'CON': '/lovable-uploads/cc51f057-9aa5-4894-8fef-9cd1eb9df743.png'
};

// College gradient mapping - enhanced for background use
const collegeGradients: Record<string, string> = {
  'CITE': 'from-red-500/20 via-red-400/10 to-red-300/5',
  'CBEAM': 'from-yellow-500/20 via-yellow-400/10 to-yellow-300/5',
  'CEAS': 'from-blue-500/20 via-blue-400/10 to-blue-300/5',
  'CIHTM': 'from-green-500/20 via-green-400/10 to-green-300/5',
  'NURSING': 'from-gray-500/20 via-gray-400/10 to-gray-300/5',
  'CON': 'from-gray-500/20 via-gray-400/10 to-gray-300/5'
};

// College accent colors
const collegeAccents: Record<string, string> = {
  'CITE': 'text-red-600',
  'CBEAM': 'text-yellow-600',
  'CEAS': 'text-blue-600',
  'CIHTM': 'text-green-600',
  'NURSING': 'text-gray-600',
  'CON': 'text-gray-600'
};

const CollegePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCollege = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('colleges')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('[CollegePage] Error fetching college:', error);
          setCollege(null);
        } else {
          console.log('[CollegePage] Successfully fetched college:', data);
          setCollege(data);
        }
      } catch (error) {
        console.error('[CollegePage] Unexpected error:', error);
        setCollege(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCollege();
  }, [id]);

  // Get only approved theses for this college
  const { data: thesesData, isLoading: thesesLoading, error: thesesError } = useTheses({ 
    college_id: id,
    status: 'approved' // Only show approved theses to public
  });
  
  const thesesArray: Thesis[] = Array.isArray(thesesData?.data) ? thesesData.data : [];
  
  // Since we're already filtering for approved theses in the query, we don't need additional filtering
  const thesesForCollege = thesesArray;

  // Filter theses based on search term - now uses the correctly declared thesesForCollege
  const filteredTheses = thesesForCollege.filter(thesis =>
    thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thesis.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thesis.abstract?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    console.log("[CollegePage] Raw theses from useTheses:", thesesArray);
    console.log("[CollegePage] Filtered thesesForCollege:", thesesForCollege);
    console.log("[CollegePage] Current college id from route:", id);
    if (thesesError) {
      console.error("[CollegePage] Theses fetch error:", thesesError);
    }
  }, [thesesArray, thesesForCollege, id, thesesError]);

  const { user } = useAuth();
  const userId = user?.id;
  const {
    data: userFavorites = [],
  } = useUserFavorites(userId) as { data: Array<{ id: string; thesis_id: string }> | undefined };

  // Map thesisId to favoriteId for fast lookup
  const favoriteMap: Record<string, string> = {};
  (userFavorites || []).forEach((fav) => {
    favoriteMap[fav.thesis_id] = fav.id;
  });

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="text-center py-20">
              <BookOpen className="h-20 w-20 text-dlsl-green mx-auto mb-6 opacity-50" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">College Not Found</h1>
              <p className="text-xl text-gray-600 mb-8">The college you're looking for doesn't exist.</p>
              <Button onClick={() => navigate('/collections')} className="bg-dlsl-green hover:bg-dlsl-green/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Collections
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get college image and gradient based on college name
  const collegeImage = college ? collegeImages[college.name] || collegeImages['CITE'] : collegeImages['CITE'];
  const collegeGradient = college ? collegeGradients[college.name] || collegeGradients['CITE'] : collegeGradients['CITE'];
  const collegeAccent = college ? collegeAccents[college.name] || collegeAccents['CITE'] : collegeAccents['CITE'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Revamped Hero Section */}
          <div className="relative mb-12 overflow-hidden">
            {/* Hero Container with Background */}
            <div className={`relative bg-gradient-to-br ${collegeGradient} rounded-3xl shadow-2xl`}>
              {/* Background Image - Made bigger and less transparent */}
              <div className="absolute inset-0 flex items-center justify-end pr-8">
                <div className="w-80 h-80 opacity-30">
                  <img 
                    src={collegeImage} 
                    alt={`${college?.name || 'College'} Background`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 px-12 py-16">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/collections')}
                  className="mb-8 text-gray-700 hover:bg-white/20 backdrop-blur-sm border border-white/20"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Collections
                </Button>
                
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-white/20 rounded w-96 mb-4"></div>
                    <div className="h-6 bg-white/10 rounded w-80 mb-3"></div>
                    <div className="h-4 bg-white/10 rounded w-64"></div>
                  </div>
                ) : college ? (
                  <div className="max-w-4xl space-y-6">
                    {/* College Name */}
                    <div className="space-y-2">
                      <h1 className={`text-6xl font-bold ${collegeAccent} leading-tight tracking-tight`}>
                        {college.name}
                      </h1>
                      <h2 className="text-2xl font-light text-gray-700 max-w-3xl leading-relaxed">
                        {college.full_name || college.name}
                      </h2>
                    </div>

                    {/* Description */}
                    <p className="text-lg text-gray-600 leading-relaxed max-w-2xl font-light">
                      {college.description || 'This college is dedicated to advancing knowledge through innovative research and academic excellence.'}
                    </p>

                    {/* Stats Badges */}
                    <div className="flex flex-wrap items-center gap-4 pt-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-700 px-6 py-3 text-base font-medium shadow-lg">
                        <BookOpen className="w-5 h-5 mr-2" />
                        {thesesForCollege.length} Research Papers
                      </Badge>
                      <Badge variant="outline" className="px-6 py-3 text-base border-white/40 text-gray-600 bg-white/60 backdrop-blur-sm shadow-lg">
                        <Users className="w-5 h-5 mr-2" />
                        Active Research Hub
                      </Badge>
                      <Badge variant="outline" className="px-6 py-3 text-base border-white/40 text-gray-600 bg-white/60 backdrop-blur-sm shadow-lg">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Growing Collection
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h1 className="text-5xl font-bold text-gray-900">College Not Found</h1>
                    <p className="text-xl text-gray-600">The college you're looking for doesn't exist or has been removed.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">Research Collection</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className={showChat ? "font-semibold text-dlsl-green" : ""}>AI Search</span>
                      <Switch
                        checked={showChat}
                        onCheckedChange={setShowChat}
                        className="mx-2"
                      />
                      <span className={!showChat ? "font-semibold text-dlsl-green" : ""}>Browse Theses</span>
                    </div>
                  </div>
                </div>

                {showChat ? (
                  <div className="animate-fade-in">
                    <ChatSearch filters={{ college: id }} />
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    {/* Search and Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search theses..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white border-gray-200 focus:border-dlsl-green focus:ring-dlsl-green"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className={viewMode === 'grid' ? 'bg-dlsl-green hover:bg-dlsl-green/90' : ''}
                        >
                          <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className={viewMode === 'list' ? 'bg-dlsl-green hover:bg-dlsl-green/90' : ''}
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Theses Display */}
                    {thesesLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dlsl-green mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading theses...</p>
                      </div>
                    ) : thesesError ? (
                      <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-6 text-center">
                          <div className="text-red-600">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">Error Loading Theses</h3>
                            <p>{thesesError.message}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : filteredTheses.length === 0 ? (
                      <Card className="border-gray-200 bg-gray-50">
                        <CardContent className="p-12 text-center">
                          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                          <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {searchTerm ? 'No matching theses found' : 'No theses available'}
                          </h3>
                          <p className="text-gray-500 mb-6">
                            {searchTerm 
                              ? 'Try adjusting your search terms or browse all theses.'
                              : 'This college doesn\'t have any published theses yet.'
                            }
                          </p>
                          {searchTerm ? (
                            <Button 
                              onClick={() => setSearchTerm('')}
                              variant="outline"
                              className="border-dlsl-green text-dlsl-green hover:bg-dlsl-green hover:text-white"
                            >
                              Clear Search
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => navigate('/explore')}
                              className="bg-dlsl-green hover:bg-dlsl-green/90"
                            >
                              Explore Other Theses
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <div className={viewMode === 'grid' 
                        ? "grid grid-cols-1 lg:grid-cols-2 gap-6" 
                        : "space-y-4"
                      }>
                        {filteredTheses.map((thesis) => (
                          <Card
                            key={thesis.id}
                            className={`group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md bg-white hover:bg-gradient-to-br hover:from-white hover:to-dlsl-green/5 ${
                              viewMode === 'list' ? 'hover:scale-[1.02]' : 'hover:scale-105'
                            }`}
                            onClick={() => navigate(`/thesis/${thesis.id}`)}
                          >
                            <CardContent className="p-6 relative">
                              {/* Favorite button */}
                              {userId && (
                                <div className="absolute top-4 right-4 z-10">
                                  <FavoriteButton
                                    userId={userId}
                                    thesisId={thesis.id}
                                    favoriteId={favoriteMap[thesis.id] || null}
                                  />
                                </div>
                              )}
                              
                              <div className="space-y-3">
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-dlsl-green transition-colors line-clamp-2">
                                  {thesis.title}
                                </h3>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span className="font-medium">{thesis.author}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{thesis.publish_date?.slice(0, 4) || "N/A"}</span>
                                  </div>
                                </div>
                                
                                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                                  {thesis.abstract || 'No abstract available.'}
                                </p>
                                
                                {thesis.keywords && thesis.keywords.length > 0 && (
                                  <div className="flex flex-wrap gap-2 pt-2">
                                    {thesis.keywords.slice(0, 4).map((keyword, i) => (
                                      <Badge
                                        key={i}
                                        variant="secondary"
                                        className="bg-dlsl-green/10 text-dlsl-green text-xs px-2 py-1 hover:bg-dlsl-green/20 transition-colors"
                                      >
                                        {keyword}
                                      </Badge>
                                    ))}
                                    {thesis.keywords.length > 4 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{thesis.keywords.length - 4} more
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* College Details */}
          {college && (
            <Card className="mb-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                  <div className="w-2 h-8 bg-dlsl-green rounded"></div>
                  About {college.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {college.description || 'This college is dedicated to advancing knowledge through innovative research and academic excellence, fostering an environment where students and faculty collaborate to push the boundaries of their respective fields.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollegePage;
