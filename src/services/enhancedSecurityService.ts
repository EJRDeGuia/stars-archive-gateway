import { supabase } from "@/integrations/supabase/client";

export interface BackupRecord {
  id: string;
  backup_type: 'full' | 'incremental' | 'config_only';
  backup_status: 'in_progress' | 'completed' | 'failed';
  backup_size_bytes?: number;
  backup_location?: string;
  encryption_status: string;
  verification_hash?: string;
  created_at: string;
  completed_at?: string;
  retention_until?: string;
  metadata?: Record<string, any>;
}

export interface SessionTimeoutInfo {
  expired: boolean;
  warning?: boolean;
  inactive_minutes?: number;
  expires_in_minutes?: number;
  timeout_in_minutes?: number;
  reason?: string;
}

export interface WatermarkInfo {
  watermark_id: string;
  watermark_data: Record<string, any>;
  verification_hash: string;
  status: string;
}

export interface DownloadPermission {
  allowed: boolean;
  permission_level?: 'metadata_only' | 'preview' | 'full_access';
  reason: string;
  requires_watermark?: boolean;
  download_limit?: number;
  permission_id?: string;
}

class EnhancedSecurityService {
  private static instance: EnhancedSecurityService;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private backupScheduleInterval: NodeJS.Timeout | null = null;
  
  private constructor() {}

  public static getInstance(): EnhancedSecurityService {
    if (!EnhancedSecurityService.instance) {
      EnhancedSecurityService.instance = new EnhancedSecurityService();
    }
    return EnhancedSecurityService.instance;
  }

  // ==================== BACKUP MANAGEMENT ====================

  async createBackup(backupType: 'full' | 'incremental' | 'config_only' = 'incremental'): Promise<BackupRecord> {
    try {
      const { data, error } = await supabase.functions.invoke('backup-manager', {
        body: {
          action: 'create_backup',
          data: { backupType, retentionDays: 30 }
        }
      });

      if (error) throw error;
      return data.backup;
    } catch (error) {
      console.error('Backup creation error:', error);
      throw new Error('Failed to create backup');
    }
  }

  async verifyBackup(backupId: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('backup-manager', {
        body: {
          action: 'verify_backup',
          data: { backupId }
        }
      });

      if (error) throw error;
      return data.verification;
    } catch (error) {
      console.error('Backup verification error:', error);
      throw new Error('Failed to verify backup');
    }
  }

  async listBackups(): Promise<BackupRecord[]> {
    try {
      const { data, error } = await supabase.functions.invoke('backup-manager', {
        body: {
          action: 'list_backups',
          data: {}
        }
      });

      if (error) throw error;
      return data.backups;
    } catch (error) {
      console.error('Backup listing error:', error);
      return [];
    }
  }

  async scheduleAutomaticBackups(): Promise<void> {
    // Schedule daily incremental backups and weekly full backups
    this.backupScheduleInterval = setInterval(async () => {
      const now = new Date();
      const isWeekly = now.getDay() === 0; // Sunday = weekly full backup
      
      try {
        await this.createBackup(isWeekly ? 'full' : 'incremental');
        console.log(`Automatic ${isWeekly ? 'full' : 'incremental'} backup completed`);
      } catch (error) {
        console.error('Scheduled backup failed:', error);
      }
    }, 24 * 60 * 60 * 1000); // Daily check
  }

  stopBackupSchedule(): void {
    if (this.backupScheduleInterval) {
      clearInterval(this.backupScheduleInterval);
      this.backupScheduleInterval = null;
    }
  }

  // ==================== SESSION TIMEOUT MANAGEMENT ====================

  async checkSessionTimeout(sessionToken: string): Promise<SessionTimeoutInfo> {
    try {
      const { data, error } = await supabase.functions.invoke('session-timeout-manager', {
        body: {
          action: 'check_session_timeout',
          data: { sessionToken }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Session timeout check error:', error);
      return { expired: true, reason: 'check_failed' };
    }
  }

  async extendSession(sessionToken: string, extensionMinutes: number = 120): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('session-timeout-manager', {
        body: {
          action: 'extend_session',
          data: { sessionToken, extensionMinutes }
        }
      });

      if (error) throw error;
      return data.success;
    } catch (error) {
      console.error('Session extension error:', error);
      return false;
    }
  }

  startSessionMonitoring(sessionToken: string): void {
    // Check session timeout every 5 minutes
    this.sessionCheckInterval = setInterval(async () => {
      const timeoutInfo = await this.checkSessionTimeout(sessionToken);
      
      if (timeoutInfo.expired) {
        this.stopSessionMonitoring();
        // Redirect to login
        window.location.href = '/login?reason=session_expired';
        return;
      }

      if (timeoutInfo.warning) {
        // Show warning to user
        const extend = confirm(
          `Your session will expire in ${timeoutInfo.timeout_in_minutes?.toFixed(0)} minutes due to inactivity. Would you like to extend it?`
        );
        
        if (extend) {
          await this.extendSession(sessionToken);
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  stopSessionMonitoring(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  // ==================== WATERMARKING SYSTEM ====================

  async applyWatermark(thesisId: string, watermarkType: 'visible' | 'invisible' | 'both' = 'invisible'): Promise<WatermarkInfo> {
    try {
      const { data, error } = await supabase.functions.invoke('watermark-service', {
        body: {
          action: 'apply_watermark',
          data: { thesisId, watermarkType }
        }
      });

      if (error) throw error;
      return data.watermark;
    } catch (error) {
      console.error('Watermark application error:', error);
      throw new Error('Failed to apply watermark');
    }
  }

  async verifyWatermark(watermarkId: string, verificationHash: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('watermark-service', {
        body: {
          action: 'verify_watermark',
          data: { watermarkId, verificationHash }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Watermark verification error:', error);
      return { verified: false, reason: 'verification_failed' };
    }
  }

  async getUserWatermarks(): Promise<any[]> {
    try {
      const { data, error } = await supabase.functions.invoke('watermark-service', {
        body: {
          action: 'get_user_watermarks',
          data: {}
        }
      });

      if (error) throw error;
      return data.watermarks;
    } catch (error) {
      console.error('Watermark retrieval error:', error);
      return [];
    }
  }

  // ==================== ENHANCED DOWNLOAD CONTROL ====================

  async validateDownloadPermission(
    thesisId: string, 
    requestedLevel: 'metadata_only' | 'preview' | 'full_access' = 'full_access'
  ): Promise<DownloadPermission> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      const { data, error } = await supabase.rpc('validate_download_permission', {
        _user_id: user.id,
        _thesis_id: thesisId,
        _requested_level: requestedLevel
      });

      if (error) throw error;
      return data as any;
    } catch (error) {
      console.error('Download permission validation error:', error);
      return {
        allowed: false,
        reason: 'validation_failed'
      };
    }
  }

  async requestDownloadPermission(
    thesisId: string,
    permissionLevel: 'preview' | 'full_access',
    justification: string
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      const { error } = await supabase
        .from('download_permissions')
        .insert({
          user_id: user.id,
          thesis_id: thesisId,
          permission_level: permissionLevel,
          justification,
          download_limit: permissionLevel === 'preview' ? 3 : 1,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Download permission request error:', error);
      return false;
    }
  }

  async processDownload(thesisId: string, permissionId?: string): Promise<{ success: boolean; watermark?: WatermarkInfo }> {
    try {
      const permission = await this.validateDownloadPermission(thesisId, 'full_access');
      
      if (!permission.allowed) {
        throw new Error(permission.reason);
      }

      let watermark: WatermarkInfo | undefined;

      // Apply watermark if required
      if (permission.requires_watermark) {
        watermark = await this.applyWatermark(thesisId, 'invisible');
      }

      // Update download count if permission exists
      if (permissionId) {
        const { data: currentPermission } = await supabase
          .from('download_permissions')
          .select('downloads_used')
          .eq('id', permissionId)
          .single();
        
        if (currentPermission) {
          await supabase
            .from('download_permissions')
            .update({ downloads_used: currentPermission.downloads_used + 1 })
            .eq('id', permissionId);
        }
      }

      // Log download
      await supabase.rpc('comprehensive_audit_log', {
        _action: 'thesis_download',
        _resource_type: 'thesis',
        _resource_id: thesisId,
        _new_data: {
          permission_level: permission.permission_level,
          watermark_applied: !!watermark,
          permission_id: permissionId
        },
        _risk_level: 'medium',
        _compliance_tags: ['download_control', 'content_access']
      });

      return { success: true, watermark };
    } catch (error) {
      console.error('Download processing error:', error);
      return { success: false };
    }
  }

  // ==================== COMPREHENSIVE SECURITY STATUS ====================

  async getSecurityStatus(): Promise<any> {
    try {
      const [
        backups,
        sessionTimeoutInfo,
        userWatermarks,
        securityAlerts
      ] = await Promise.all([
        this.listBackups(),
        this.getCurrentSessionStatus(),
        this.getUserWatermarks(),
        this.getRecentSecurityAlerts()
      ]);

      return {
        backups: {
          total: backups.length,
          recent: backups.slice(0, 3),
          last_backup: backups[0]?.created_at || 'Never'
        },
        session: sessionTimeoutInfo,
        watermarks: {
          total: userWatermarks.length,
          active: userWatermarks.filter(w => w.is_active).length
        },
        security_alerts: {
          total: securityAlerts.length,
          high_priority: securityAlerts.filter(a => a.severity === 'high').length,
          recent: securityAlerts.slice(0, 5)
        }
      };
    } catch (error) {
      console.error('Security status retrieval error:', error);
      return null;
    }
  }

  private async getCurrentSessionStatus(): Promise<SessionTimeoutInfo> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        return { expired: true, reason: 'no_session' };
      }
      
      return await this.checkSessionTimeout(session.access_token);
    } catch (error) {
      return { expired: true, reason: 'check_failed' };
    }
  }

  private async getRecentSecurityAlerts(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Security alerts retrieval error:', error);
      return [];
    }
  }

  // ==================== CLEANUP METHODS ====================

  cleanup(): void {
    this.stopSessionMonitoring();
    this.stopBackupSchedule();
  }
}

export const enhancedSecurityService = EnhancedSecurityService.getInstance();