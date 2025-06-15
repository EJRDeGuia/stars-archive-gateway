
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ChartPoint {
  label: string;
  value: number;
}

export function useResearcherViewsAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      if (!user) return;
      // Fetch theses uploaded by this user
      const { data: theses } = await supabase
        .from("theses")
        .select("id, title")
        .eq("uploaded_by", user.id);

      if (!theses || theses.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }
      const thesisIds = theses.map((t: any) => t.id);

      // Aggregate views per thesis
      const { data: viewRows } = await supabase
        .from("thesis_views")
        .select("thesis_id")
        .in("thesis_id", thesisIds);

      const viewCountMap: Record<string, number> = {};
      for (const t of thesisIds) {
        viewCountMap[t] = 0;
      }
      (viewRows || []).forEach((v: any) => {
        if (viewCountMap[v.thesis_id] !== undefined) {
          viewCountMap[v.thesis_id]++;
        }
      });

      // Prepare chart data
      const chartData = (theses || []).map((thesis: any) => ({
        label: thesis.title?.substring(0, 20) ?? "(untitled)",
        value: viewCountMap[thesis.id] ?? 0,
      }));
      setData(chartData);
      setLoading(false);
    };
    fetchAnalytics();
  }, [user]);

  return { data, loading };
}
