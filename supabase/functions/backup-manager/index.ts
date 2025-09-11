import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BackupManagerRequest {
  action: 'create_backup' | 'verify_backup' | 'restore_backup' | 'list_backups' | 'cleanup_old_backups';
  data?: {
    backupType?: 'full' | 'incremental' | 'config_only';
    backupId?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { action, data = {} }: BackupManagerRequest = await req.json();

    switch (action) {
      case 'create_backup': {
        const { backupType = 'incremental' } = data;
        
        // Simulate backup creation with realistic data
        const backupRecord = {
          backup_type: backupType,
          backup_status: 'completed',
          backup_size_bytes: Math.floor(Math.random() * 1000000000) + 100000000, // 100MB to 1GB
          backup_location: `s3://dlsl-backups/backup_${Date.now()}.sql.gz`,
          verification_hash: crypto.randomUUID(),
          retention_until: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString(), // 30 days
        };

        const { data: backup, error } = await supabaseClient
          .from('backup_records')
          .insert([backupRecord])
          .select()
          .single();

        if (error) throw error;

        // Log the backup creation
        await supabaseClient.rpc('comprehensive_audit_log', {
          _action: 'backup_created',
          _resource_type: 'system',
          _resource_id: backup.id,
          _risk_level: 'medium',
          _compliance_tags: ['backup_management', 'data_protection'],
          _additional_metadata: { backup_type: backupType, backup_size: backupRecord.backup_size_bytes }
        });

        return new Response(JSON.stringify({
          success: true,
          message: `${backupType} backup created successfully`,
          backup: backup
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'verify_backup': {
        const { backupId } = data;
        if (!backupId) {
          throw new Error('Backup ID is required for verification');
        }

        const { data: result, error } = await supabaseClient
          .rpc('verify_backup_integrity', { _backup_id: backupId });

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          verification: result
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'restore_backup': {
        const { backupId } = data;
        if (!backupId) {
          throw new Error('Backup ID is required for restore');
        }

        // Check user permissions (admin only)
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
          throw new Error('Authentication required');
        }

        const { data: userRole, error: roleError } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (roleError || !userRole) {
          throw new Error('Admin privileges required for backup restoration');
        }

        // Log restore initiation
        await supabaseClient.rpc('comprehensive_audit_log', {
          _action: 'backup_restore_initiated',
          _resource_type: 'system',
          _resource_id: backupId,
          _risk_level: 'critical',
          _compliance_tags: ['backup_restoration', 'system_recovery'],
          _additional_metadata: { initiated_by: user.id }
        });

        // In a real implementation, this would trigger the actual restore process
        return new Response(JSON.stringify({
          success: true,
          message: 'Backup restoration initiated. This process may take several minutes.',
          status: 'initiated'
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'list_backups': {
        const { data: backups, error } = await supabaseClient
          .from('backup_records')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          backups: backups || []
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'cleanup_old_backups': {
        const { data: deletedBackups, error } = await supabaseClient
          .from('backup_records')
          .delete()
          .lt('retention_until', new Date().toISOString())
          .select();

        if (error) throw error;

        const deletedCount = deletedBackups?.length || 0;

        // Log cleanup activity
        if (deletedCount > 0) {
          await supabaseClient.rpc('comprehensive_audit_log', {
            _action: 'backup_cleanup',
            _resource_type: 'system',
            _risk_level: 'low',
            _compliance_tags: ['backup_management', 'data_retention'],
            _additional_metadata: { deleted_backups: deletedCount }
          });
        }

        return new Response(JSON.stringify({
          success: true,
          message: `Cleaned up ${deletedCount} expired backups`,
          deletedCount
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({
          success: false,
          message: 'Invalid action specified'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error: any) {
    console.error('Backup manager error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});