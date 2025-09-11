import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BackupRecord {
  id: string;
  backup_type: string;
  backup_status: string;
  backup_size_bytes: number | null;
  backup_location: string | null;
  verification_hash: string | null;
  created_at: string;
  completed_at: string | null;
  retention_until: string | null;
}

export const useBackupManager = () => {
  const queryClient = useQueryClient();

  // Fetch backup records
  const { data: backups = [], isLoading } = useQuery({
    queryKey: ['backup-records'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('backup-manager', {
        body: { action: 'list_backups' }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.message);
      
      return data.backups as BackupRecord[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Create backup mutation
  const createBackup = useMutation({
    mutationFn: async (backupType: 'full' | 'incremental' | 'config_only' = 'incremental') => {
      const { data, error } = await supabase.functions.invoke('backup-manager', {
        body: { 
          action: 'create_backup',
          data: { backupType }
        }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.message);
      
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['backup-records'] });
    },
    onError: (error: any) => {
      toast.error(`Backup failed: ${error.message}`);
    }
  });

  // Verify backup mutation
  const verifyBackup = useMutation({
    mutationFn: async (backupId: string) => {
      const { data, error } = await supabase.functions.invoke('backup-manager', {
        body: { 
          action: 'verify_backup',
          data: { backupId }
        }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.message);
      
      return data.verification;
    },
    onSuccess: (data) => {
      if (data.status === 'verified') {
        toast.success('Backup verification successful');
      } else {
        toast.error('Backup verification failed');
      }
    },
    onError: (error: any) => {
      toast.error(`Verification failed: ${error.message}`);
    }
  });

  // Restore backup mutation
  const restoreBackup = useMutation({
    mutationFn: async (backupId: string) => {
      const { data, error } = await supabase.functions.invoke('backup-manager', {
        body: { 
          action: 'restore_backup',
          data: { backupId }
        }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.message);
      
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(`Restore failed: ${error.message}`);
    }
  });

  // Cleanup old backups mutation
  const cleanupOldBackups = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('backup-manager', {
        body: { action: 'cleanup_old_backups' }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.message);
      
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['backup-records'] });
    },
    onError: (error: any) => {
      toast.error(`Cleanup failed: ${error.message}`);
    }
  });

  return {
    backups,
    isLoading,
    createBackup: createBackup.mutate,
    verifyBackup: verifyBackup.mutate,
    restoreBackup: restoreBackup.mutate,
    cleanupOldBackups: cleanupOldBackups.mutate,
    isCreatingBackup: createBackup.isPending,
    isVerifying: verifyBackup.isPending,
    isRestoring: restoreBackup.isPending,
    isCleaning: cleanupOldBackups.isPending,
  };
};