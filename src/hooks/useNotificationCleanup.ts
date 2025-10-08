import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to automatically cleanup expired notifications
 * Runs cleanup every 5 minutes for admin users only
 */
export const useNotificationCleanup = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Only run cleanup for admin users
    if (!user || user.role !== 'admin') return;

    const runCleanup = async () => {
      try {
        const { data, error } = await supabase
          .rpc('cleanup_expired_notifications');

        if (error) {
          console.error('Notification cleanup error:', error);
          return;
        }

        if (data > 0) {
          console.log(`Cleaned up ${data} expired notifications`);
        }
      } catch (error) {
        console.error('Notification cleanup failed:', error);
      }
    };

    // Run cleanup immediately on mount
    runCleanup();

    // Set up interval to run cleanup every 5 minutes
    const intervalId = setInterval(runCleanup, 5 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [user]);
};
