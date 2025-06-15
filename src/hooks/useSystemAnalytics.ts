
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChartPoint {
  label: string;
  value: number;
}

export function useSystemAnalytics() {
  const [viewsSeries, setViewsSeries] = useState<ChartPoint[]>([]);
  const [uploadsSeries, setUploadsSeries] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemAnalytics = async () => {
      setLoading(true);

      // We will generate views/7days and uploads/7days, grouped by day
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
      });
      // Views
      const { data: viewRows } = await supabase
        .from("thesis_views")
        .select("viewed_at");

      // Group views by day
      const viewMap: Record<string, number> = {};
      days.forEach((date) => {
        const key = date.toLocaleDateString();
        viewMap[key] = 0;
      });

      (viewRows || []).forEach((v: any) => {
        if (v.viewed_at) {
          const d = new Date(v.viewed_at);
          const key = d.toLocaleDateString();
          if (key in viewMap) {
            viewMap[key]++;
          }
        }
      });

      setViewsSeries(
        days.map((date) => ({
          label: date.toLocaleDateString("en-US", { weekday: "short" }),
          value: viewMap[date.toLocaleDateString()] || 0,
        }))
      );

      // Uploads by day (theses created)
      const { data: thesisRows } = await supabase
        .from("theses")
        .select("created_at");

      const uploadMap: Record<string, number> = {};
      days.forEach((date) => {
        const key = date.toLocaleDateString();
        uploadMap[key] = 0;
      });

      (thesisRows || []).forEach((t: any) => {
        if (t.created_at) {
          const d = new Date(t.created_at);
          const key = d.toLocaleDateString();
          if (key in uploadMap) {
            uploadMap[key]++;
          }
        }
      });

      setUploadsSeries(
        days.map((date) => ({
          label: date.toLocaleDateString("en-US", { weekday: "short" }),
          value: uploadMap[date.toLocaleDateString()] || 0,
        }))
      );

      setLoading(false);
    };

    fetchSystemAnalytics();
  }, []);

  return { viewsSeries, uploadsSeries, loading };
}
