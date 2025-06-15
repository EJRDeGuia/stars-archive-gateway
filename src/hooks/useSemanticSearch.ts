
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCallback } from "react";
import { semanticSearchService } from "@/services/semanticSearch";

export function useSemanticSearch() {
  const navigate = useNavigate();

  const handleSemanticSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) return;
      try {
        const results = await semanticSearchService.semanticSearch(searchQuery.trim(), 50);
        localStorage.setItem("exploreResults", JSON.stringify(results));
        localStorage.setItem("lastExploreQuery", searchQuery.trim());
        navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
      } catch {
        toast.error("Failed to perform semantic search.");
      }
    },
    [navigate]
  );

  return { handleSemanticSearch };
}
