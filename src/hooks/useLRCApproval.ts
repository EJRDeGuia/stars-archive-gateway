
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
      const { data, error } = await supabase
        .from('lrc_approval_requests')
        .insert({
          thesis_id: thesisId,
          request_type: requestType,
          justification: justification.trim()
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('You already have a pending request for this thesis');
          return { success: false, error: 'Duplicate request' };
        }
        throw error;
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

      toast.success('Access request submitted successfully. You will be notified when reviewed.');
      return { success: true, data };

    } catch (error: any) {
      console.error('LRC approval request failed:', error);
      toast.error('Failed to submit request. Please try again.');
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
