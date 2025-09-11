
import { useAuth } from "@/contexts/AuthContext";
import { useSavedConversations } from "@/hooks/useApi";
import { BookOpen, Heart, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { formatDistanceToNow } from 'date-fns';

type Favorite = {
  id: string;
  thesis_id: string;
  created_at: string;
  theses?: {
    id: string;
    title: string;
    author: string;
  };
}


export default function MyCollectionsSection() {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch favorites with thesis details
  const { data: favorites = [], refetch } = useQuery({
    queryKey: ["user_favorites_with_theses", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('[MyCollections] Fetching favorites for user:', userId);
      
      const { data, error } = await supabase
        .from("user_favorites")
        .select(`
          id,
          thesis_id,
          created_at,
          theses (
            id,
            title,
            author
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error('[MyCollections] Error fetching favorites:', error);
        throw error;
      }
      
      console.log('[MyCollections] Fetched favorites:', data);
      return data as Favorite[] || [];
    },
    enabled: !!userId,
  });

  
  const { data: savedConversations = [] } = useSavedConversations(userId);

  // Set up real-time subscription for favorites
  useEffect(() => {
    if (!userId) return;

    console.log('[MyCollections] Setting up real-time subscription for user:', userId);
    
    const channel = supabase
      .channel('dashboard_favorites_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_favorites',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('[MyCollections] Real-time update received:', payload);
          // Invalidate and refetch the favorites query
          queryClient.invalidateQueries({ queryKey: ["user_favorites_with_theses", userId] });
          refetch();
        }
      )
      .subscribe();

    return () => {
      console.log('[MyCollections] Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient, refetch]);

  return (
    <div className="mb-16 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          My Collections
        </h2>
        <p className="text-gray-600">Your saved research and conversations at a glance</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Favorites */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-rose-50/50 border border-rose-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-50 rounded-full blur-xl opacity-50"></div>
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-100 rounded-lg">
                <Heart className="text-rose-600 h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">My Library</h3>
                <p className="text-sm text-gray-600">{favorites.length} saved theses</p>
              </div>
            </div>
            {favorites.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-6 w-6 text-rose-400" />
                </div>
                <p className="text-gray-500 text-sm">None yet. Add favorites from thesis pages!</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {favorites.slice(0, 5).map((favorite, index) => (
                  <li
                    className="group/item cursor-pointer transition-all duration-200 hover:translate-x-1"
                    key={favorite.id}
                    onClick={() => navigate(`/thesis/${favorite.thesis_id}`)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {favorite.theses?.title ? (
                      <div className="p-3 rounded-lg border border-rose-100 hover:border-rose-200 hover:bg-white/60 transition-all duration-200">
                        <div className="font-medium line-clamp-1 text-gray-900 group-hover/item:text-rose-600">
                          {favorite.theses.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">by {favorite.theses.author}</div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg border border-rose-100 hover:border-rose-200 hover:bg-white/60 transition-all duration-200">
                        <span className="text-gray-600">Thesis #{favorite.thesis_id?.slice(0, 6) || ""}</span>
                      </div>
                    )}
                  </li>
                ))}
                {favorites.length > 5 && (
                  <li className="text-xs text-gray-400 text-center pt-2 border-t border-rose-100">
                    +{favorites.length - 5} more items
                  </li>
                )}
              </ul>
            )}
          </div>
        </Card>
        
        {/* Saved Conversations */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50/50 border border-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-sky-50 rounded-full blur-xl opacity-50"></div>
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="text-blue-600 h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Saved Conversations</h3>
                <p className="text-sm text-gray-600">{savedConversations.length} conversations</p>
              </div>
            </div>
            {savedConversations.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-gray-500 text-sm">No saved conversations yet.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {savedConversations.slice(0, 5).map((conversation: any, index: number) => (
                  <li
                    key={conversation.id}
                    className="group/item cursor-pointer transition-all duration-200 hover:translate-x-1"
                    onClick={() => navigate(`/explore?conversation=${conversation.id}`)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-3 rounded-lg border border-blue-100 hover:border-blue-200 hover:bg-white/60 transition-all duration-200">
                      <div className="font-medium line-clamp-1 text-gray-900 group-hover/item:text-blue-600">
                        {conversation.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })} • {conversation.conversation_data?.length || 0} messages
                      </div>
                    </div>
                  </li>
                ))}
                {savedConversations.length > 5 && (
                  <li className="text-xs text-gray-400 text-center pt-2 border-t border-blue-100">
                    +{savedConversations.length - 5} more conversations
                  </li>
                )}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
