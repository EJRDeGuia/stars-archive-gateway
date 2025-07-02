
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
  const [optimisticFavorited, setOptimisticFavorited] = useState<boolean | null>(null);

  // Use optimistic state if available, otherwise use actual favorite state
  const isFavorited = optimisticFavorited !== null ? optimisticFavorited : !!favoriteId;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    const wasAlreadyFavorited = !!favoriteId;
    
    // Optimistic update - immediately update UI
    setOptimisticFavorited(!wasAlreadyFavorited);
    setIsLoading(true);
    
    try {
      console.log('[FavoriteButton] Starting toggle favorite:', { userId, thesisId, favoriteId, wasAlreadyFavorited });
      
      const result = await toggleFavorite.mutateAsync({ userId, thesisId, favoriteId });
      
      console.log('[FavoriteButton] Toggle favorite result:', result);
      
      // Check if operation was successful
      if ('removed' in result && result.removed) {
        toast.success("Removed from library");
        onToggle?.(false);
        setOptimisticFavorited(false);
      } else if ('added' in result && result.added) {
        toast.success("Saved to library");
        onToggle?.(true);
        setOptimisticFavorited(true);
      } else {
        // If we get here, something unexpected happened
        console.warn('[FavoriteButton] Unexpected result format:', result);
        // Revert optimistic update
        setOptimisticFavorited(null);
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error('[FavoriteButton] Error toggling favorite:', error);
      
      // Revert optimistic update on error
      setOptimisticFavorited(null);
      
      // Show more specific error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to update library. Please check your connection and try again.";
      
      toast.error(errorMessage);
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
