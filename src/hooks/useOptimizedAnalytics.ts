import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsDataPoint {
  label: string;
  value: number;
}

/**
 * Optimized analytics hook using database functions for better performance
 */
export function useOptimizedAnalytics(daysBack: number = 7) {
  // Views analytics
  const { 
    data: viewsData, 
    isLoading: viewsLoading 
  } = useQuery({
    queryKey: ['views-analytics', daysBack],
    queryFn: async (): Promise<AnalyticsDataPoint[]> => {
      const { data, error } = await supabase.rpc('get_views_analytics', { 
        days_back: daysBack 
      });
      
      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        label: item.date,
        value: Number(item.views || 0)
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - analytics are relatively stable
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    refetchOnWindowFocus: false,
  });

  // Uploads analytics  
  const { 
    data: uploadsData, 
    isLoading: uploadsLoading 
  } = useQuery({
    queryKey: ['uploads-analytics', daysBack],
    queryFn: async (): Promise<AnalyticsDataPoint[]> => {
      const { data, error } = await supabase.rpc('get_uploads_analytics', { 
        days_back: daysBack 
      });
      
      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        label: item.date,
        value: Number(item.uploads || 0)
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    refetchOnWindowFocus: false,
  });

  return {
    viewsSeries: viewsData || [],
    uploadsSeries: uploadsData || [],
    loading: viewsLoading || uploadsLoading,
    viewsLoading,
    uploadsLoading,
  };
}