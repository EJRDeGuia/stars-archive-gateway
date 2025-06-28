
import { useToggleFavorite } from "@/hooks/useApi";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

type FavoriteButtonProps = {
  userId: string;
  thesisId: string;
  favoriteId?: string | null;
};

export default function FavoriteButton({ userId, thesisId, favoriteId }: FavoriteButtonProps) {
  const toggleFavorite = useToggleFavorite();
  const [loading, setLoading] = useState(false);

  const isFavorited = !!favoriteId;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setLoading(true);
    try {
      await toggleFavorite.mutateAsync({ userId, thesisId, favoriteId });
      if (isFavorited) {
        toast.success("Removed from library");
      } else {
        toast.success("Saved to library");
      }
    } catch (error) {
      toast.error("Failed to update library");
      console.error("Error toggling favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      size="icon"
      onClick={handleClick}
      disabled={loading}
      className={`rounded-full border-none transition-all duration-200 ${
        isFavorited 
          ? "bg-pink-500/20 text-pink-600 hover:bg-pink-500/30" 
          : "bg-white text-gray-400 hover:text-pink-600 hover:bg-pink-50"
      } ${loading ? 'opacity-50' : ''}`}
      aria-label={isFavorited ? "Remove from library" : "Save to library"}
    >
      <Heart 
        className={`h-5 w-5 transition-all duration-200 ${
          isFavorited ? "fill-pink-500" : "fill-none"
        }`}
        strokeWidth={2}
      />
    </Button>
  );
}
