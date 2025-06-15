
import { useToggleFavorite } from "@/hooks/useApi";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type FavoriteButtonProps = {
  userId: string;
  thesisId: string;
  favoriteId?: string | null;
};

export default function FavoriteButton({ userId, thesisId, favoriteId }: FavoriteButtonProps) {
  const toggleFavorite = useToggleFavorite();
  const [loading, setLoading] = useState(false);

  const isFavorited = !!favoriteId;

  const handleClick = async () => {
    setLoading(true);
    try {
      await toggleFavorite.mutateAsync({ userId, thesisId, favoriteId });
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
      className={`rounded-full border-none ${isFavorited ? "bg-pink-500/20 text-pink-600" : "bg-white text-gray-400 hover:text-pink-600"}`}
      aria-label="Favorite"
    >
      <Heart 
        className={`h-5 w-5 transition-all duration-200 ${isFavorited ? "fill-pink-500" : "fill-none"}`}
        strokeWidth={2}
      />
    </Button>
  );
}
