
import { useAuth } from "@/hooks/useAuth";
import { useUserFavorites, useSavedSearches } from "@/hooks/useApi";
import { BookOpen, Search, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

type SavedSearch = {
  id: string;
  name: string;
  query: string;
  created_at?: string;
}

export default function MyCollectionsSection() {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  // Fetch favorites with thesis details
  const { data: favorites = [] } = useQuery({
    queryKey: ["user_favorites_with_theses", userId],
    queryFn: async () => {
      if (!userId) return [];
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
      
      if (error) throw error;
      return data as Favorite[] || [];
    },
    enabled: !!userId,
  });

  const { data: savedSearches = [] } = useSavedSearches(userId) as { data: SavedSearch[] | undefined };

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-4 text-slate-800">My Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Favorites */}
        <Card className="p-6 bg-white/95 border border-dlsl-green/15">
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
        
        {/* Saved Searches */}
        <Card className="p-6 bg-white/95 border border-dlsl-green/15">
          <div className="flex items-center gap-3 mb-2 font-semibold">
            <Search className="text-dlsl-green" /> Saved Searches
          </div>
          {savedSearches.length === 0 ? (
            <div className="text-gray-400 text-sm">No saved searches yet.</div>
          ) : (
            <ul className="text-dlsl-green font-medium space-y-1">
              {savedSearches.slice(0, 5).map((s) => (
                <li
                  key={s.id}
                  className="hover:underline cursor-pointer"
                  onClick={() =>
                    navigate(`/explore?q=${encodeURIComponent(s.query)}`)
                  }
                >
                  {s.name} <span className="text-xs text-gray-400">({s.created_at?.slice(0,10)})</span>
                </li>
              ))}
              {savedSearches.length > 5 && (
                <li className="text-xs text-gray-400 mt-1">+{savedSearches.length - 5} more</li>
              )}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
