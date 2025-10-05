import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to track thesis views with anti-spam logic
 * Prevents duplicate counts from the same session/user
 */
export const useViewTracking = (thesisId: string | undefined) => {
  const { user } = useAuth();
  const hasTracked = useRef(false);
  
  useEffect(() => {
    if (!thesisId || hasTracked.current) return;
    
    const trackView = async () => {
      try {
        // Check if view was already tracked in this session
        const sessionKey = `view_tracked_${thesisId}`;
        const alreadyTracked = sessionStorage.getItem(sessionKey);
        
        if (alreadyTracked) {
          return; // Already tracked in this session
        }
        
        // Insert view record
        const { error: insertError } = await supabase
          .from('thesis_views')
          .insert({
            thesis_id: thesisId,
            user_id: user?.id || null,
            viewed_at: new Date().toISOString(),
          });
        
        if (insertError) {
          console.error('Error tracking view:', insertError);
          return;
        }
        
        // Increment view count on thesis
        const { data: currentThesis } = await supabase
          .from('theses')
          .select('view_count')
          .eq('id', thesisId)
          .single();
        
        const newViewCount = (currentThesis?.view_count || 0) + 1;
        
        const { error: updateError } = await supabase
          .from('theses')
          .update({ view_count: newViewCount })
          .eq('id', thesisId);
        
        if (updateError) {
          console.error('Error updating view count:', updateError);
          return;
        }
        
        // Mark as tracked in session storage
        sessionStorage.setItem(sessionKey, 'true');
        hasTracked.current = true;
        
      } catch (error) {
        console.error('View tracking error:', error);
      }
    };
    
    // Track view after a short delay to ensure it's an intentional view
    const timer = setTimeout(trackView, 2000);
    
    return () => clearTimeout(timer);
  }, [thesisId, user?.id]);
};
