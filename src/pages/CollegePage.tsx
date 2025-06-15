import React, { useState, useEffect } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Calendar, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTheses } from "@/hooks/useApi";
import type { Thesis } from "@/types/thesis";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ChatSearch from "@/components/ChatSearch";
import FavoriteButton from "@/components/FavoriteButton";
import { useAuth } from "@/hooks/useAuth";
import { useUserFavorites } from "@/hooks/useApi";

const CollegePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('colleges')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setCollege(data || null);
        setLoading(false);
      });
  }, [id]);

  // Get theses for this college by college_id (UUID)
  const { data: theses = [] } = useTheses();
  const thesesArray: Thesis[] = Array.isArray(theses) ? theses : [];
  // Ensure both sides are string and trimmed for reliable comparison
  const thesesForCollege = thesesArray.filter((t) => {
    const match =
      String(t.college_id).trim() === String(id).trim();
    // Debug: Show mapping for each thesis
    console.log(
      `[CollegePage] thesis.id=${t.id}, t.college_id="${t.college_id}" vs id="${id}" match: ${match}`
    );
    return match;
  });

  useEffect(() => {
    console.log("[CollegePage] Raw theses from useTheses:", thesesArray);
    console.log("[CollegePage] Filtered thesesForCollege:", thesesForCollege);
    console.log("[CollegePage] Current college id from route:", id);
  }, [thesesArray, thesesForCollege, id]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Button variant="ghost" onClick={() => navigate('/collections')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Collections
                </Button>
                {loading ? (
                  <h1 className="text-4xl font-bold text-gray-900 mt-4">Loading...</h1>
                ) : college ? (
                  <h1 className="text-4xl font-bold text-gray-900 mt-4">{college.name}</h1>
                ) : (
                  <h1 className="text-4xl font-bold text-gray-900 mt-4">College Not Found</h1>
                )}
                <p className="text-xl text-gray-600">Explore research and theses from {college?.name}</p>
              </div>
              {/* Chat Toggle - always visible now */}
              <div className="flex flex-col items-end">
                <label htmlFor="chat-toggle" className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <span className={showChat ? "font-semibold text-dlsl-green" : ""}>Chat</span>
                  <Switch
                    id="chat-toggle"
                    checked={showChat}
                    onCheckedChange={setShowChat}
                    className="mx-2"
                  />
                  <span className={!showChat ? "font-semibold text-dlsl-green" : ""}>Theses List</span>
                </label>
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto pt-8">
            {showChat ? (
              <div className="mb-10 animate-fade-in">
                {/* More interactive style for ChatSearch */}
                <ChatSearch filters={{ college: id }} />
              </div>
            ) : (
              <section className="mb-10 animate-fade-in">
                <Card className="w-full mb-6 bg-white/95 shadow-md border border-dlsl-green/10">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-3 text-dlsl-green">
                      All Theses from {college?.name}
                    </h2>
                    {/* ALERT if theses fetched but no results */}
                    {thesesArray.length > 0 && thesesForCollege.length === 0 && (
                      <div className="text-center text-yellow-600 py-3 border border-yellow-400 rounded mb-4">
                        No theses found for this college. (Fetched {thesesArray.length} thesis records, but none match this college.)
                        <pre className="mt-2 text-xs text-yellow-900 bg-yellow-50 rounded p-2 max-w-full overflow-auto">{JSON.stringify(thesesArray, null, 2)}</pre>
                        <div className="text-xs text-gray-500 font-mono">College ID: {id}</div>
                      </div>
                    )}
                    {thesesForCollege.length === 0 ? (
                      <div className="text-center text-slate-400 py-8">
                        No theses found for this college.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {thesesForCollege.map((thesis) => (
                          <div
                            key={thesis.id}
                            className="border border-slate-100 rounded-lg p-5 bg-slate-50 hover:bg-dlsl-green/5 transition-all cursor-pointer shadow-sm relative"
                          >
                            {/* Favorite button (top right) */}
                            {userId && (
                              <div className="absolute top-3 right-4 z-10">
                                <FavoriteButton
                                  userId={userId}
                                  thesisId={thesis.id}
                                  favoriteId={favoriteMap[thesis.id] || null}
                                />
                              </div>
                            )}
                            <div className="font-bold text-dlsl-green text-lg mb-1">{thesis.title}</div>
                            <div className="text-xs text-slate-500 mb-1">
                              {thesis.author} • {thesis.publish_date?.slice(0, 4) || "N/A"} •{" "}
                              <span>{college?.name || thesis.college_id}</span>
                            </div>
                            <div className="text-slate-700 text-sm mb-2">
                              {thesis.abstract?.substring(0, 110)}...
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {thesis.keywords?.slice(0, 4).map((k, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-full bg-dlsl-green/10 text-xs text-dlsl-green"
                                >
                                  {k}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            )}
          </div>
          {/* College Details */}
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading college details...</div>
          ) : college ? (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {college.name}</h2>
                <p className="text-gray-700 leading-relaxed">{college.description}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-gray-400">College not found.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollegePage;
