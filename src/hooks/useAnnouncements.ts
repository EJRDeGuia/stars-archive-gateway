import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_active: boolean;
  target_roles: string[];
  priority: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  created_by?: string;
}

export const useAnnouncements = () => {
  const { user } = useAuth();

  // Fetch active announcements for current user's role
  const { data: announcements = [], isLoading, error } = useQuery({
    queryKey: ['announcements', user?.role],
    queryFn: async () => {
      let query = supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      // Filter by user role if authenticated
      if (user?.role) {
        query = query.contains('target_roles', [user.role]);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Filter out expired announcements
      const now = new Date();
      return (data || []).filter((announcement: any) => 
        !announcement.expires_at || new Date(announcement.expires_at) > now
      ) as Announcement[];
    },
    enabled: !!user
  });

  // Get high priority announcements (priority >= 4)
  const highPriorityAnnouncements = announcements.filter(a => a.priority >= 4);

  // Get recent announcements (created in last 7 days)
  const recentAnnouncements = announcements.filter(a => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(a.created_at) > weekAgo;
  });

  return {
    announcements,
    highPriorityAnnouncements,
    recentAnnouncements,
    isLoading,
    error
  };
};