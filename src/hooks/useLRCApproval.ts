
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuditLog } from './useAuditLog';
import { toast } from 'sonner';

interface LRCApprovalRequest {
  thesisId: string;
  requestType: 'full_text_access' | 'download_access';
  justification: string;
}

export const useLRCApproval = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { logEvent } = useAuditLog();

  const submitApprovalRequest = async ({ thesisId, requestType, justification }: LRCApprovalRequest) => {
    setIsLoading(true);
    try {
      // Validate inputs
      if (!thesisId || !requestType || !justification.trim()) {
        toast.error('All fields are required');
        return { success: false, error: 'Invalid input' };
      }

      if (justification.trim().length < 50) {
        toast.error('Justification must be at least 50 characters');
        return { success: false, error: 'Justification too short' };
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to submit a request');
        return { success: false, error: 'User not authenticated' };
      }

      // Check for existing pending request
      const { data: existingRequest } = await supabase
        .from('lrc_approval_requests')
        .select('id, status')
        .eq('thesis_id', thesisId)
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (existingRequest) {
        toast.error('You already have a pending request for this thesis');
        return { success: false, error: 'Duplicate request' };
      }

      // Submit the request
      const { data, error } = await supabase
        .from('lrc_approval_requests')
        .insert({
          thesis_id: thesisId,
          user_id: user.id,
          request_type: requestType,
          justification: justification.trim()
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error('You already have a pending request for this thesis');
          return { success: false, error: 'Duplicate request' };
        }
        console.error('Database error:', error);
        toast.error('Failed to submit request. Please try again.');
        return { success: false, error: error.message };
      }

      // Log the request
      await logEvent({
        action: 'lrc_approval_requested',
        resourceType: 'thesis',
        resourceId: thesisId,
        details: { 
          request_type: requestType,
          request_id: data.id 
        }
      });

      toast.success('Access request submitted successfully! You will receive an email notification when reviewed.');
      return { success: true, data };

    } catch (error: any) {
      console.error('LRC approval request failed:', error);
      toast.error('An unexpected error occurred. Please try again or contact support.');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRequests = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('lrc_approval_requests')
        .select(`
          *,
          theses!inner(id, title, author)
        `)
        .eq('user_id', userId)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Failed to fetch user requests:', error);
      return { success: false, error: error.message, data: [] };
    }
  };

  return {
    submitApprovalRequest,
    getUserRequests,
    isLoading
  };
};
