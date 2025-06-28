
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RecentThesis {
  id: string;
  title: string;
  author: string;
  college_name?: string;
  publish_date?: string;
}

export function useRecentTheses() {
  const { user } = useAuth();
  const [recentTheses, setRecentTheses] = useState<RecentThesis[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchRecentTheses = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('thesis_views')
          .select(`
            thesis_id,
            viewed_at,
            theses!inner (
              id,
              title,
              author,
              publish_date,
              colleges (
                name
              )
            )
          `)
          .eq('user_id', user.id)
          .order('viewed_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        const recent = data?.map(view => ({
          id: view.theses.id,
          title: view.theses.title,
          author: view.theses.author,
          college_name: view.theses.colleges?.name,
          publish_date: view.theses.publish_date
        })) || [];

        setRecentTheses(recent);
      } catch (error) {
        console.error('Failed to fetch recent theses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTheses();
  }, [user?.id]);

  return { recentTheses, isLoading };
}
