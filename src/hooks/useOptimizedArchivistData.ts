import { useEffect, useState, useCallback, useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalTheses: number;
  approvedTheses: number;
  pendingReview: number;
  thisMonthUploads: number;
  totalCollections: number;
  totalViews7Days: number;
}

interface RecentUpload {
  id: string;
  title: string;
  author: string;
  college: string;
  uploadDate: string;
  status: string;
}

/**
 * Optimized hook for Archivist Dashboard data using database functions
 * Much faster than individual queries with proper caching
 */
export function useOptimizedArchivistData() {
  // Optimized stats query using database function
  const { 
    data: statsData, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('No stats data returned');
      
      const stats = data[0];
      return {
        totalTheses: Number(stats.total_theses || 0),
        approvedTheses: Number(stats.approved_theses || 0),
        pendingReview: Number(stats.pending_review || 0),
        thisMonthUploads: Number(stats.this_month_uploads || 0),
        totalCollections: Number(stats.total_collections || 0),
        totalViews7Days: Number(stats.total_views_7days || 0),
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - stats don't change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Optimized recent uploads query using database function
  const { 
    data: uploadsData, 
    isLoading: uploadsLoading, 
    error: uploadsError 
  } = useQuery({
    queryKey: ['recent-uploads'],
    queryFn: async (): Promise<RecentUpload[]> => {
      const { data, error } = await supabase.rpc('get_recent_uploads');
      
      if (error) throw error;
      
      return (data || []).map((upload: any) => ({
        id: upload.id,
        title: upload.title,
        author: upload.author,
        college: upload.college_name || "Unknown College",
        uploadDate: upload.created_at 
          ? new Date(upload.created_at).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short"
            })
          : "",
        status: upload.status || "pending_review"
      }));
    },
    staleTime: 1 * 60 * 1000, // 1 minute - uploads are more dynamic
    gcTime: 3 * 60 * 1000, // 3 minutes cache
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Memoized return values to prevent unnecessary re-renders
  const stats = useMemo(() => statsData || {
    totalTheses: 0,
    approvedTheses: 0,
    pendingReview: 0,
    thisMonthUploads: 0,
    totalCollections: 0,
    totalViews7Days: 0,
  }, [statsData]);

  const recentUploads = useMemo(() => uploadsData || [], [uploadsData]);

  const loading = statsLoading || uploadsLoading;
  const error = statsError || uploadsError;

  return { 
    stats, 
    recentUploads, 
    loading, 
    error,
    // Individual loading states for granular control
    statsLoading,
    uploadsLoading,
  };
}