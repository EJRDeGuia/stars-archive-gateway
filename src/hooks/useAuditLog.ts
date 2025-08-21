
import { supabase } from '@/integrations/supabase/client';

interface AuditLogParams {
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
}

export const useAuditLog = () => {
  const logEvent = async ({ action, resourceType, resourceId, details }: AuditLogParams) => {
    try {
      // Get client IP and user agent
      const ipAddress = null; // Will be captured server-side
      const userAgent = navigator.userAgent;

      const { error } = await supabase.rpc('log_audit_event', {
        _action: action,
        _resource_type: resourceType,
        _resource_id: resourceId || null,
        _details: details ? JSON.stringify(details) : null,
        _ip_address: ipAddress,
        _user_agent: userAgent
      });

      if (error) {
        console.warn('Audit log failed:', error);
        // Don't throw - audit logging failures shouldn't break user experience
      }
    } catch (error) {
      console.warn('Audit log error:', error);
    }
  };

  return { logEvent };
};
