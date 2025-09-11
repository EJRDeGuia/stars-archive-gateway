
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
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-4 text-slate-800">My Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Favorites */}
        <Card className="p-6 bg-white/95 border border-dlsl-green/15 rounded-xl shadow-sm hover-scale animate-fade-in">
          <div className="flex items-center gap-3 mb-2 font-semibold">
            <Heart className="text-dlsl-green" /> My Library ({favorites.length})
          </div>
          {favorites.length === 0 ? (
            <div className="text-gray-400 text-sm">None yet. Add favorites from thesis pages!</div>
          ) : (
            <ul className="text-dlsl-green font-medium space-y-1">
              {favorites.slice(0, 5).map((favorite) => (
                <li
                  className="hover:underline cursor-pointer text-sm"
                  key={favorite.id}
                  onClick={() => navigate(`/thesis/${favorite.thesis_id}`)}
                >
                  {favorite.theses?.title ? (
                    <div>
                      <div className="font-medium line-clamp-1">{favorite.theses.title}</div>
                      <div className="text-xs text-gray-500">by {favorite.theses.author}</div>
                    </div>
                  ) : (
                    `Thesis #${favorite.thesis_id?.slice(0, 6) || ""}`
                  )}
                </li>
              ))}
              {favorites.length > 5 && (
                <li className="text-xs text-gray-400 mt-1">+{favorites.length - 5} more</li>
              )}
            </ul>
          )}
        </Card>
        
        {/* Saved Conversations */}
        <Card className="p-6 bg-white/95 border border-dlsl-green/15 rounded-xl shadow-sm hover-scale animate-fade-in">
          <div className="flex items-center gap-3 mb-2 font-semibold">
            <MessageCircle className="text-dlsl-green" /> Saved Conversations ({savedConversations.length})
          </div>
          {savedConversations.length === 0 ? (
            <div className="text-gray-400 text-sm">No saved conversations yet.</div>
          ) : (
            <ul className="text-dlsl-green font-medium space-y-1">
              {savedConversations.slice(0, 5).map((conversation: any) => (
                <li
                  key={conversation.id}
                  className="hover:underline cursor-pointer text-sm"
                  onClick={() => navigate(`/explore?conversation=${conversation.id}`)}
                >
                  <div>
                    <div className="font-medium line-clamp-1">{conversation.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })} • {conversation.conversation_data?.length || 0} messages
                    </div>
                  </div>
                </li>
              ))}
              {savedConversations.length > 5 && (
                <li className="text-xs text-gray-400 mt-1">+{savedConversations.length - 5} more</li>
              )}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
