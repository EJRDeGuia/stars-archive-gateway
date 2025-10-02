
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RecentThesis {
  id: string;
  title: string;
  author: string;
  abstract?: string;
  view_count?: number;
  college_name?: string;
  publish_date?: string;
}

export function useRecentTheses() {
  const { user } = useAuth();
  const [recentTheses, setRecentTheses] = useState<RecentThesis[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      console.log('No user ID, skipping recent theses fetch');
      return;
    }

    const fetchRecentTheses = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching recent theses for user:', user.id);
        
        const { data, error } = await supabase
          .from('thesis_views')
          .select(`
            thesis_id,
            viewed_at,
            theses!inner (
              id,
              title,
              author,
              abstract,
              view_count,
              publish_date,
              colleges (
                name
              )
            )
          `)
          .eq('user_id', user.id)
          .order('viewed_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching recent theses:', error);
          throw error;
        }

        console.log('Recent theses data:', data);

        const recent = data?.map(view => ({
          id: view.theses.id,
          title: view.theses.title,
          author: view.theses.author,
          abstract: view.theses.abstract,
          view_count: view.theses.view_count,
          college_name: view.theses.colleges?.name,
          publish_date: view.theses.publish_date
        })) || [];

        console.log('Processed recent theses:', recent);
        setRecentTheses(recent);
      } catch (error) {
        console.error('Failed to fetch recent theses:', error);
        setRecentTheses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTheses();
  }, [user?.id]);

  return { recentTheses, isLoading };
}
