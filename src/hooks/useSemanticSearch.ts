
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuditLog } from './useAuditLog';
import { toast } from 'sonner';

export interface SemanticSearchResult {
  id: string;
  title: string;
  author: string;
  abstract: string;
  keywords?: string[];
  college_name?: string;
  publish_date?: string;
  similarity_score?: number;
  view_count?: number;
  download_count?: number;
  cover_image_url?: string;
}

export const useSemanticSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const { logEvent } = useAuditLog();

  const performSemanticSearch = async (
    query: string, 
    limit: number = 20,
    matchThreshold: number = 0.7
  ) => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return [];
    }

    setIsLoading(true);
    
    try {
      console.log('Starting semantic search for:', query);

      // Call the semantic search edge function
      const { data, error } = await supabase.functions.invoke('semantic-search', {
        body: {
          query: query.trim(),
          match_threshold: matchThreshold,
          match_count: limit
        }
      });

      if (error) {
        console.error('Semantic search error:', error);
        toast.error('Search failed. Please try again.');
        return [];
      }

      if (!data?.results || !Array.isArray(data.results)) {
        console.warn('No results from semantic search');
        setResults([]);
        return [];
      }

      const searchResults: SemanticSearchResult[] = data.results.map((result: any) => ({
        id: result.id,
        title: result.title,
        author: result.author,
        abstract: result.abstract,
        keywords: result.keywords,
        college_name: result.college_name,
        publish_date: result.publish_date,
        similarity_score: result.similarity,
        view_count: result.view_count || 0,
        download_count: result.download_count || 0,
        cover_image_url: result.cover_image_url
      }));

      setResults(searchResults);

      // Log semantic search
      await logEvent({
        action: 'semantic_search_performed',
        resourceType: 'search',
        details: {
          query,
          match_threshold: matchThreshold,
          results_count: searchResults.length,
          avg_similarity: searchResults.length > 0 
            ? searchResults.reduce((sum, r) => sum + (r.similarity_score || 0), 0) / searchResults.length
            : 0
        }
      });

      console.log(`Semantic search completed: ${searchResults.length} results`);
      return searchResults;

    } catch (error) {
      console.error('Semantic search error:', error);
      toast.error('Search failed. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getSimilarTheses = async (
    thesisId: string,
    limit: number = 5,
    matchThreshold: number = 0.8
  ) => {
    setIsLoading(true);
    
    try {
      console.log('Finding similar theses for:', thesisId);

      const { data, error } = await supabase.functions.invoke('semantic-search', {
        body: {
          similar_to_thesis: thesisId,
          match_threshold: matchThreshold,
          match_count: limit
        }
      });

      if (error) {
        console.error('Similar theses search error:', error);
        return [];
      }

      if (!data?.results || !Array.isArray(data.results)) {
        return [];
      }

      const similarTheses: SemanticSearchResult[] = data.results.map((result: any) => ({
        id: result.id,
        title: result.title,
        author: result.author,
        abstract: result.abstract,
        keywords: result.keywords,
        college_name: result.college_name,
        publish_date: result.publish_date,
        similarity_score: result.similarity,
        view_count: result.view_count || 0,
        download_count: result.download_count || 0,
        cover_image_url: result.cover_image_url
      }));

      // Log similar theses search
      await logEvent({
        action: 'similar_theses_searched',
        resourceType: 'thesis',
        resourceId: thesisId,
        details: {
          match_threshold: matchThreshold,
          results_count: similarTheses.length
        }
      });

      return similarTheses;

    } catch (error) {
      console.error('Similar theses search error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return {
    performSemanticSearch,
    getSimilarTheses,
    clearResults,
    isLoading,
    results
  };
};
