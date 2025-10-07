
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
    // Fetch recent theses regardless of user (public data)
    // User is only needed for auth context, not for filtering

    const fetchRecentTheses = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching recently added theses');
        
        // Fetch the most recently uploaded theses (not user-specific views)
        const { data, error } = await supabase
          .from('theses')
          .select(`
            id,
            title,
            author,
            abstract,
            view_count,
            publish_date,
            created_at,
            colleges (
              name
            )
          `)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Error fetching recent theses:', error);
          throw error;
        }

        console.log('Recently added theses data:', data);

        const recent = data?.map(thesis => ({
          id: thesis.id,
          title: thesis.title,
          author: thesis.author,
          abstract: thesis.abstract,
          view_count: thesis.view_count,
          college_name: thesis.colleges?.name,
          publish_date: thesis.publish_date
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
  }, []); // Fetch once on mount

  return { recentTheses, isLoading };
}
