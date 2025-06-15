
import { useAuth } from "@/hooks/useAuth";
import { useUserFavorites, useSavedSearches } from "@/hooks/useApi";
import { BookOpen, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

type Favorite = {
  id: string;
  thesis_id: string;
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
  const { data: favorites = [] } = useUserFavorites(userId) as { data: Favorite[] | undefined };
  const { data: savedSearches = [] } = useSavedSearches(userId) as { data: SavedSearch[] | undefined };
  const navigate = useNavigate();

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-4 text-slate-800">My Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Favorites */}
        <Card className="p-6 bg-white/95 border border-dlsl-green/15">
          <div className="flex items-center gap-3 mb-2 font-semibold">
            <BookOpen className="text-dlsl-green" /> Favorites
          </div>
          {favorites.length === 0 ? (
            <div className="text-gray-400 text-sm">None yet. Add favorites from thesis pages!</div>
          ) : (
            <ul className="text-dlsl-green font-medium space-y-1">
              {favorites.slice(0, 5).map((f) => (
                <li
                  className="hover:underline cursor-pointer"
                  key={f.id}
                  onClick={() => navigate(`/thesis/${f.thesis_id}`)}
                >
                  Thesis #{f.thesis_id?.slice(0, 6) || ""}
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
