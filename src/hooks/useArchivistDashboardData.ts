
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

      // 4. Fetch 5 most recent uploads, with needed fields
      const { data: uploads } = await supabase
        .from("theses")
        .select("id,title,author,college,created_at,status")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalTheses: totalTheses ?? 0,
        pendingReview: pendingReview ?? 0,
        thisMonth: thisMonth ?? 0
      });

      // Map data for RecentUploads component
      setRecentUploads(
        (uploads ?? []).map((thesis: any) => ({
          id: thesis.id,
          title: thesis.title,
          author: thesis.author,
          college: thesis.college,
          uploadDate: thesis.created_at
            ? new Date(thesis.created_at).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short"
              })
            : "",
          status: thesis.status || "pending_review"
        }))
      );
      setLoading(false);
    };
    fetchData();
  }, []);

  return { stats, recentUploads, loading };
}
