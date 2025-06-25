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
import { useAuth } from "@/hooks/useAuth";
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

  // Get theses for this college by college_id (UUID)
  const { data: theses = [], isLoading: thesesLoading, error: thesesError } = useTheses();
  const thesesArray: Thesis[] = Array.isArray(theses) ? theses : [];
  
  // Filter theses for this college with better comparison - moved before filteredTheses
  const thesesForCollege = thesesArray.filter((t) => {
    const match = String(t.college_id).trim() === String(id).trim();
    console.log(
      `[CollegePage] thesis.id=${t.id}, t.college_id="${t.college_id}" vs id="${id}" match: ${match}`
    );
    return match;
  });

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

  // Get college image based on college name
  const collegeImage = college ? collegeImages[college.name] || collegeImages['CITE'] : collegeImages['CITE'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Enhanced Hero Section */}
          <div className="relative py-20 mb-12 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-dlsl-green/5 to-dlsl-green/10 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-dlsl-green/5 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-dlsl-green/10 rounded-full translate-y-32 -translate-x-32"></div>
            
            <div className="relative z-10">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/collections')}
                className="mb-8 text-dlsl-green hover:bg-dlsl-green/10 backdrop-blur-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Collections
              </Button>
              
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-16 bg-gray-300 rounded w-80 mb-6"></div>
                  <div className="h-8 bg-gray-200 rounded w-96 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-64"></div>
                </div>
              ) : college ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left Column - Text Content */}
                  <div className="space-y-8">
                    {/* College Name */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-12 bg-dlsl-green rounded-full"></div>
                        <h1 className="text-6xl font-bold text-gray-900 leading-tight">
                          {college.name}
                        </h1>
                      </div>
                      
                      {/* Full Name */}
                      <div className="ml-5">
                        <h2 className="text-2xl font-medium text-gray-700 leading-relaxed">
                          {college.full_name || college.name}
                        </h2>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="ml-5 space-y-4">
                      <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                        {college.description || 'This college is dedicated to advancing knowledge through innovative research and academic excellence, fostering an environment where students and faculty collaborate to push the boundaries of their respective fields.'}
                      </p>
                    </div>

                    {/* Stats Badges */}
                    <div className="ml-5 flex flex-wrap items-center gap-4">
                      <Badge variant="secondary" className="bg-dlsl-green/15 text-dlsl-green px-6 py-3 text-base font-medium">
                        <BookOpen className="w-5 h-5 mr-2" />
                        {thesesForCollege.length} Research Papers
                      </Badge>
                      <Badge variant="outline" className="px-6 py-3 text-base border-dlsl-green/30">
                        <Users className="w-5 h-5 mr-2 text-dlsl-green" />
                        Active Research Hub
                      </Badge>
                      <Badge variant="outline" className="px-6 py-3 text-base border-dlsl-green/30">
                        <TrendingUp className="w-5 h-5 mr-2 text-dlsl-green" />
                        Growing Collection
                      </Badge>
                    </div>
                  </div>

                  {/* Right Column - College Image */}
                  <div className="flex justify-center lg:justify-end">
                    <div className="relative">
                      {/* Image Container with Styling */}
                      <div className="relative w-80 h-80 bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-dlsl-green/5 to-dlsl-green/10 rounded-3xl"></div>
                        <img 
                          src={collegeImage} 
                          alt={`${college.name} Logo`}
                          className="relative z-10 w-full h-full object-contain filter drop-shadow-lg"
                        />
                      </div>
                      
                      {/* Decorative Elements */}
                      <div className="absolute -top-4 -right-4 w-16 h-16 bg-dlsl-green/10 rounded-full"></div>
                      <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-dlsl-green/20 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h1 className="text-5xl font-bold text-gray-900 mb-4">College Not Found</h1>
                  <p className="text-xl text-gray-600">The college you're looking for doesn't exist or has been removed.</p>
                </div>
              )}
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
