
import { useToggleFavorite } from "@/hooks/useApi";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

type FavoriteButtonProps = {
  userId: string;
  thesisId: string;
  favoriteId?: string | null;
  onToggle?: (isFavorited: boolean) => void;
};

export default function FavoriteButton({ userId, thesisId, favoriteId, onToggle }: FavoriteButtonProps) {
  const toggleFavorite = useToggleFavorite();
  const [isLoading, setIsLoading] = useState(false);

  const isFavorited = !!favoriteId;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsLoading(true);
    
    try {
      const result = await toggleFavorite.mutateAsync({ userId, thesisId, favoriteId });
      
      if (result.removed) {
        toast.success("Removed from library");
        onToggle?.(false);
      } else {
        toast.success("Saved to library");
        onToggle?.(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update library");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      size="icon"
      onClick={handleClick}
      disabled={isLoading || toggleFavorite.isPending}
      className={`rounded-full border-none transition-all duration-200 ${
        isFavorited 
          ? "bg-pink-500/20 text-pink-600 hover:bg-pink-500/30" 
          : "bg-white text-gray-400 hover:text-pink-600 hover:bg-pink-50"
      } ${(isLoading || toggleFavorite.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isFavorited ? "Remove from library" : "Save to library"}
    >
      <Heart 
        className={`h-5 w-5 transition-all duration-200 ${
          isFavorited ? "fill-pink-500" : "fill-none"
        } ${(isLoading || toggleFavorite.isPending) ? 'animate-pulse' : ''}`}
        strokeWidth={2}
      />
    </Button>
  );
}
