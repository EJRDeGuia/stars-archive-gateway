import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Hook to monitor access request status changes and notify users
 */
export const useRequestNotifications = () => {
  const { user } = useAuth();
  const lastStatusCheck = useRef<Record<string, string>>({});

  const { data: requests = [] } = useQuery({
    queryKey: ['request-notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('lrc_approval_requests')
        .select(`
          id,
          status,
          reviewed_at,
          reviewer_notes,
          theses!inner(title)
        `)
        .eq('user_id', user.id)
        .order('reviewed_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return data;
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Notify users of status changes
  useEffect(() => {
    if (!requests || requests.length === 0) return;

    requests.forEach((request: any) => {
      const previousStatus = lastStatusCheck.current[request.id];
      
      if (previousStatus && previousStatus !== request.status && request.reviewed_at) {
        // Status changed - notify user
        if (request.status === 'approved') {
          toast.success(
            `Access approved for "${request.theses.title}"`,
            {
              description: request.reviewer_notes || 'You can now access this thesis',
              duration: 10000,
            }
          );
        } else if (request.status === 'rejected') {
          toast.error(
            `Access request denied for "${request.theses.title}"`,
            {
              description: request.reviewer_notes || 'Please contact LRC for more information',
              duration: 10000,
            }
          );
        }
      }
      
      lastStatusCheck.current[request.id] = request.status;
    });
  }, [requests]);

  return { requests };
};
