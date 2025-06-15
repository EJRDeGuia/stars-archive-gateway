
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdminDashboardData() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [theses, setTheses] = useState<any[]>([]);
  const [thesesLoading, setThesesLoading] = useState(true);

  useEffect(() => {
    setCollegesLoading(true);
    supabase
      .from('colleges')
      .select('*')
      .order('name', { ascending: true })
      .then(({ data }) => {
        setColleges(data || []);
        setCollegesLoading(false);
      });
  }, []);

  useEffect(() => {
    setThesesLoading(true);
    supabase
      .from('theses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setTheses(data || []);
        setThesesLoading(false);
      });
  }, []);

  return { colleges, collegesLoading, theses, thesesLoading };
}
