
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook for fetching Archivist Dashboard data: stats & recent uploads.
 * Keeps data concerns outside UI layer for clean separation.
 */
export function useArchivistDashboardData() {
  const [stats, setStats] = useState({
    totalTheses: 0,
    pendingReview: 0,
    thisMonth: 0
  });
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats and recent uploads in parallel
    const fetchData = async () => {
      setLoading(true);

      try {
        // 1. Fetch total number of theses
        const { count: totalTheses } = await supabase
          .from("theses")
          .select("*", { count: "exact", head: true });

        // 2. Fetch pending review count
        const { count: pendingReview } = await supabase
          .from("theses")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending_review");

        // 3. Fetch this month's theses
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const { count: thisMonth } = await supabase
          .from("theses")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfMonth.toISOString());

        // 4. Fetch 5 most recent uploads, join with college name
        const { data: uploads } = await supabase
          .from("theses")
          .select("id,title,author,college_id,created_at,status, colleges ( name )")
          .order("created_at", { ascending: false })
          .limit(5);

        // Map college_id to name (fallback for missing)
        setStats({
          totalTheses: totalTheses ?? 0,
          pendingReview: pendingReview ?? 0,
          thisMonth: thisMonth ?? 0
        });

        setRecentUploads(
          (uploads ?? []).map((thesis: any) => ({
            id: thesis.id,
            title: thesis.title,
            author: thesis.author,
            college:
              thesis.colleges?.name ||
              thesis.college_id ||
              "Unknown College",
            uploadDate: thesis.created_at
              ? new Date(thesis.created_at).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short"
                })
              : "",
            status: thesis.status || "pending_review"
          }))
        );
      } catch (error) {
        console.error('[useArchivistDashboardData] Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up real-time subscription for thesis updates
    const subscription = supabase
      .channel('archivist-dashboard')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'theses' 
        }, 
        () => {
          console.log('[useArchivistDashboardData] Real-time update detected, refetching...');
          fetchData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { stats, recentUploads, loading };
}
