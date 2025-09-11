import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  action: 'create_notification' | 'broadcast_notification' | 'get_notifications';
  data?: {
    title?: string;
    message?: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    targetRoles?: string[];
    targetUsers?: string[];
    expiresAt?: string;
    metadata?: any;
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

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    const { action, data = {} }: NotificationRequest = await req.json();

    switch (action) {
      case 'create_notification': {
        const { title, message, type = 'info', targetRoles = [], targetUsers = [], expiresAt, metadata } = data;
        
        if (!title || !message) {
          throw new Error('Title and message are required');
        }

        let createdNotifications = [];

        // Create notifications for specific users
        if (targetUsers.length > 0) {
          for (const userId of targetUsers) {
            const { data: notification, error } = await supabaseClient
              .from('notifications')
              .insert([{
                user_id: userId,
                title,
                message,
                type,
                expires_at: expiresAt || null,
                metadata: metadata || null
              }])
              .select()
              .single();

            if (error) throw error;
            createdNotifications.push(notification);
          }
        }

        // Create notifications for users with specific roles
        if (targetRoles.length > 0) {
          const { data: roleUsers, error: roleError } = await supabaseClient
            .from('user_roles')
            .select('user_id')
            .in('role', targetRoles);

          if (roleError) throw roleError;

          for (const roleUser of roleUsers || []) {
            const { data: notification, error } = await supabaseClient
              .from('notifications')
              .insert([{
                user_id: roleUser.user_id,
                title,
                message,
                type,
                expires_at: expiresAt || null,
                metadata: metadata || null
              }])
              .select()
              .single();

            if (error) throw error;
            createdNotifications.push(notification);
          }
        }

        // Log notification creation
        await supabaseClient.rpc('comprehensive_audit_log', {
          _action: 'notification_created',
          _resource_type: 'notification',
          _risk_level: 'low',
          _compliance_tags: ['notification_system'],
          _additional_metadata: {
            title,
            type,
            target_roles: targetRoles,
            target_users_count: targetUsers.length,
            created_by: user.email
          }
        });

        return new Response(JSON.stringify({
          success: true,
          message: `Created ${createdNotifications.length} notifications`,
          notifications: createdNotifications
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'broadcast_notification': {
        const { title, message, type = 'info', expiresAt, metadata } = data;
        
        if (!title || !message) {
          throw new Error('Title and message are required');
        }

        // Check admin permissions for broadcast
        const { data: userRole, error: roleError } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['admin', 'archivist'])
          .single();

        if (roleError || !userRole) {
          throw new Error('Admin or archivist privileges required for broadcast notifications');
        }

        // Use the database function to create system-wide notification
        const { data: result, error } = await supabaseClient
          .rpc('create_system_notification', {
            _title: title,
            _message: message,
            _type: type,
            _target_roles: ['researcher', 'archivist', 'admin'],
            _expires_at: expiresAt || null
          });

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          message: 'Broadcast notification sent successfully',
          notificationId: result
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_notifications': {
        // Get notifications for the current user with role-based filtering
        const { data: userRoles, error: roleError } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (roleError) throw roleError;

        const userRolesList = userRoles?.map(r => r.role) || ['researcher'];

        const { data: notifications, error } = await supabaseClient
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        // Filter out expired notifications
        const activeNotifications = notifications?.filter(notification => {
          if (!notification.expires_at) return true;
          return new Date(notification.expires_at) > new Date();
        }) || [];

        return new Response(JSON.stringify({
          success: true,
          notifications: activeNotifications,
          unreadCount: activeNotifications.filter(n => !n.is_read).length
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
    console.error('Notification manager error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});