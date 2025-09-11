import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { enhancedSecurityService } from '@/services/enhancedSecurityService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SecurityStatus {
  backups: {
    total: number;
    recent: any[];
    last_backup: string;
  };
  session: {
    expired: boolean;
    warning?: boolean;
    inactive_minutes?: number;
    expires_in_minutes?: number;
    timeout_in_minutes?: number;
  };
  watermarks: {
    total: number;
    active: number;
  };
  security_alerts: {
    total: number;
    high_priority: number;
    recent: any[];
  };
}

export const useEnhancedSecurity = () => {
  const { user } = useAuth();
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionMonitoringActive, setSessionMonitoringActive] = useState(false);

  // Load security status
  const loadSecurityStatus = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const status = await enhancedSecurityService.getSecurityStatus();
      setSecurityStatus(status);
    } catch (error) {
      console.error('Security status loading error:', error);
      toast.error('Failed to load security status');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initialize session monitoring
  const initializeSessionMonitoring = useCallback(async () => {
    if (!user || sessionMonitoringActive) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        enhancedSecurityService.startSessionMonitoring(session.access_token);
        setSessionMonitoringActive(true);
      }
    } catch (error) {
      console.error('Session monitoring initialization error:', error);
    }
  }, [user, sessionMonitoringActive]);

  // Backup management
  const createBackup = useCallback(async (backupType: 'full' | 'incremental' | 'config_only' = 'incremental') => {
    try {
      toast.info('Creating backup...');
      const backup = await enhancedSecurityService.createBackup(backupType);
      toast.success(`${backupType} backup created successfully`);
      await loadSecurityStatus(); // Refresh status
      return backup;
    } catch (error) {
      console.error('Backup creation error:', error);
      toast.error('Failed to create backup');
      throw error;
    }
  }, [loadSecurityStatus]);

  const verifyBackup = useCallback(async (backupId: string) => {
    try {
      const verification = await enhancedSecurityService.verifyBackup(backupId);
      if (verification.status === 'verified') {
        toast.success('Backup verification successful');
      } else {
        toast.error('Backup verification failed');
      }
      return verification;
    } catch (error) {
      console.error('Backup verification error:', error);
      toast.error('Backup verification failed');
      throw error;
    }
  }, []);

  // Session management
  const extendSession = useCallback(async (extensionMinutes: number = 120) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No active session');
      }

      const success = await enhancedSecurityService.extendSession(session.access_token, extensionMinutes);
      if (success) {
        toast.success(`Session extended by ${extensionMinutes} minutes`);
        await loadSecurityStatus();
      } else {
        toast.error('Failed to extend session');
      }
      return success;
    } catch (error) {
      console.error('Session extension error:', error);
      toast.error('Failed to extend session');
      return false;
    }
  }, [loadSecurityStatus]);

  // Watermark management
  const applyWatermark = useCallback(async (
    thesisId: string, 
    watermarkType: 'visible' | 'invisible' | 'both' = 'invisible'
  ) => {
    try {
      toast.info('Applying watermark...');
      const watermark = await enhancedSecurityService.applyWatermark(thesisId, watermarkType);
      toast.success('Watermark applied successfully');
      await loadSecurityStatus();
      return watermark;
    } catch (error) {
      console.error('Watermark application error:', error);
      toast.error('Failed to apply watermark');
      throw error;
    }
  }, [loadSecurityStatus]);

  const getUserWatermarks = useCallback(async () => {
    try {
      return await enhancedSecurityService.getUserWatermarks();
    } catch (error) {
      console.error('Watermark retrieval error:', error);
      toast.error('Failed to retrieve watermarks');
      return [];
    }
  }, []);

  // Download permission management
  const validateDownloadPermission = useCallback(async (
    thesisId: string,
    requestedLevel: 'metadata_only' | 'preview' | 'full_access' = 'full_access'
  ) => {
    try {
      return await enhancedSecurityService.validateDownloadPermission(thesisId, requestedLevel);
    } catch (error) {
      console.error('Download permission validation error:', error);
      return {
        allowed: false,
        reason: 'validation_error'
      };
    }
  }, []);

  const requestDownloadPermission = useCallback(async (
    thesisId: string,
    permissionLevel: 'preview' | 'full_access',
    justification: string
  ) => {
    try {
      const success = await enhancedSecurityService.requestDownloadPermission(
        thesisId,
        permissionLevel,
        justification
      );
      
      if (success) {
        toast.success('Download permission request submitted');
      } else {
        toast.error('Failed to submit download permission request');
      }
      
      return success;
    } catch (error) {
      console.error('Download permission request error:', error);
      toast.error('Failed to submit download permission request');
      return false;
    }
  }, []);

  const processSecureDownload = useCallback(async (thesisId: string, permissionId?: string) => {
    try {
      toast.info('Processing secure download...');
      const result = await enhancedSecurityService.processDownload(thesisId, permissionId);
      
      if (result.success) {
        if (result.watermark) {
          toast.success('Download processed with watermark applied');
        } else {
          toast.success('Download processed successfully');
        }
      } else {
        toast.error('Download processing failed');
      }
      
      return result;
    } catch (error) {
      console.error('Secure download error:', error);
      toast.error('Secure download failed');
      return { success: false };
    }
  }, []);

  // Enhanced security monitoring
  const performSecurityScan = useCallback(async () => {
    try {
      toast.info('Performing security scan...');
      
      // Run comprehensive security checks
      const checks = await Promise.all([
        enhancedSecurityService.getSecurityStatus(),
        supabase.functions.invoke('security-monitor', {
          body: {
            action: 'detect_anomalies',
            data: {}
          }
        }),
        supabase.functions.invoke('security-monitor', {
          body: {
            action: 'check_ip_reputation',
            data: {}
          }
        })
      ]);

      toast.success('Security scan completed');
      await loadSecurityStatus();
      
      return {
        security_status: checks[0],
        anomaly_detection: checks[1].data,
        ip_reputation: checks[2].data
      };
    } catch (error) {
      console.error('Security scan error:', error);
      toast.error('Security scan failed');
      throw error;
    }
  }, [loadSecurityStatus]);

  // Initialize enhanced security on mount
  useEffect(() => {
    if (user) {
      loadSecurityStatus();
      initializeSessionMonitoring();
      
      // Schedule automatic backups for admins
      if (user.role === 'admin') {
        enhancedSecurityService.scheduleAutomaticBackups();
      }
    }

    return () => {
      enhancedSecurityService.cleanup();
      setSessionMonitoringActive(false);
    };
  }, [user, loadSecurityStatus, initializeSessionMonitoring]);

  // Refresh security status periodically
  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(() => {
      loadSecurityStatus();
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(refreshInterval);
  }, [user, loadSecurityStatus]);

  return {
    // Status
    securityStatus,
    isLoading,
    sessionMonitoringActive,

    // Actions
    loadSecurityStatus,
    createBackup,
    verifyBackup,
    extendSession,
    applyWatermark,
    getUserWatermarks,
    validateDownloadPermission,
    requestDownloadPermission,
    processSecureDownload,
    performSecurityScan,

    // Utilities
    refreshSecurityStatus: loadSecurityStatus
  };
};