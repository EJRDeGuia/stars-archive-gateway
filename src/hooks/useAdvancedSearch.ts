import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchFilters {
  colleges?: string[];
  programs?: string[];
  keywords?: string[];
  authors?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
}

interface SearchResult {
  id: string;
  title: string;
  author: string;
  abstract: string;
  keywords: string[];
  publish_date: string;
  view_count: number;
  download_count: number;
  colleges: { id: string; name: string; color: string };
  programs?: { id: string; name: string; degree_level: string };
  relevanceScore: number;
  matchedFields: string[];
}

interface SearchOptions {
  query?: string;
  filters?: SearchFilters;
  sortBy?: 'relevance' | 'date' | 'title' | 'author' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  searchType?: 'comprehensive' | 'semantic';
}

interface SearchResponse {
  results: SearchResult[];
  pagination: {
    page: number;
    limit: number;
    totalResults: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  searchMeta: {
    query: string;
    filters: SearchFilters;
    sortBy: string;
    searchType: string;
    executionTime: number;
  };
}

export const useAdvancedSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [pagination, setPagination] = useState<SearchResponse['pagination'] | null>(null);
  const [searchMeta, setSearchMeta] = useState<SearchResponse['searchMeta'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (options: SearchOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('advanced-search', {
        body: {
          query: options.query || '',
          filters: options.filters || {},
          sortBy: options.sortBy || 'relevance',
          sortOrder: options.sortOrder || 'desc',
          page: options.page || 1,
          limit: options.limit || 10,
          searchType: options.searchType || 'comprehensive'
        }
      });

      if (error) throw error;

      setResults(data.results || []);
      setPagination(data.pagination);
      setSearchMeta(data.searchMeta);
    } catch (err: any) {
      console.error('Advanced search error:', err);
      setError(err.message);
      setResults([]);
      setPagination(null);
      setSearchMeta(null);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setPagination(null);
    setSearchMeta(null);
    setError(null);
  };

  return {
    results,
    pagination,
    searchMeta,
    loading,
    error,
    actions: {
      search,
      clearResults
    }
  };
};