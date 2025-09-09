import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Recommendation {
  id: string;
  title: string;
  author: string;
  abstract: string;
  keywords: string[];
  publish_date: string;
  colleges: { name: string };
  score: number;
  reason: string;
}

interface RecommendationOptions {
  thesisId?: string;
  type: 'similar' | 'trending' | 'personalized';
  limit?: number;
}

export const useAIRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (options: RecommendationOptions) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          userId: user?.id,
          thesisId: options.thesisId,
          type: options.type,
          limit: options.limit || 5
        }
      });

      if (error) throw error;

      setRecommendations(data.recommendations || []);
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTrendingRecommendations = () => {
    return fetchRecommendations({ type: 'trending', limit: 6 });
  };

  const getSimilarRecommendations = (thesisId: string) => {
    return fetchRecommendations({ type: 'similar', thesisId, limit: 5 });
  };

  const getPersonalizedRecommendations = () => {
    if (!user) return Promise.resolve();
    return fetchRecommendations({ type: 'personalized', limit: 8 });
  };

  return {
    recommendations,
    loading,
    error,
    actions: {
      fetchRecommendations,
      getTrendingRecommendations,
      getSimilarRecommendations,
      getPersonalizedRecommendations
    }
  };
};