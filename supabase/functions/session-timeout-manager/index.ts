import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, data } = await req.json();
    
    console.log(`Session timeout manager action: ${action}`);

    switch (action) {
      case 'check_session_timeout': {
        const { sessionToken } = data;
        
        // Validate session and check for timeout
        const { data: session, error } = await supabase
          .from('session_tracking')
          .select('*')
          .eq('session_token', sessionToken)
          .eq('is_active', true)
          .single();

        if (error || !session) {
          return new Response(
            JSON.stringify({
              expired: true,
              reason: 'session_not_found'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const now = new Date();
        const lastActivity = new Date(session.last_activity);
        const expiresAt = new Date(session.expires_at);
        const inactivityMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
        
        // Session timeout rules:
        // - Hard expiry: expires_at
        // - Inactivity timeout: 2 hours
        // - Warning threshold: 1.5 hours of inactivity
        
        const isExpired = now > expiresAt || inactivityMinutes > 120;
        const isWarning = inactivityMinutes > 90 && !isExpired;
        
        if (isExpired) {
          // Deactivate expired session
          await supabase
            .from('session_tracking')
            .update({ is_active: false })
            .eq('id', session.id);

          // Log session timeout
          await supabase.rpc('comprehensive_audit_log', {
            _action: 'session_timeout',
            _resource_type: 'session',
            _resource_id: session.id,
            _new_data: {
              session_id: session.id,
              user_id: session.user_id,
              timeout_reason: now > expiresAt ? 'hard_expiry' : 'inactivity',
              last_activity: session.last_activity,
              inactive_minutes: inactivityMinutes
            },
            _risk_level: 'low',
            _compliance_tags: ['session_management', 'timeout_policy']
          });

          return new Response(
            JSON.stringify({
              expired: true,
              reason: now > expiresAt ? 'hard_expiry' : 'inactivity_timeout',
              inactive_minutes: inactivityMinutes
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Update last activity if session is still valid
        if (!isWarning) {
          await supabase
            .from('session_tracking')
            .update({ last_activity: now.toISOString() })
            .eq('id', session.id);
        }

        return new Response(
          JSON.stringify({
            expired: false,
            warning: isWarning,
            inactive_minutes: inactivityMinutes,
            expires_in_minutes: Math.max(0, (expiresAt.getTime() - now.getTime()) / (1000 * 60)),
            timeout_in_minutes: Math.max(0, 120 - inactivityMinutes)
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'extend_session': {
        const { sessionToken, extensionMinutes = 120 } = data;
        
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: 'Authentication required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          );
        }

        const { data: { user } } = await supabase.auth.getUser(
          authHeader.replace('Bearer ', '')
        );

        if (!user) {
          return new Response(
            JSON.stringify({ error: 'Invalid authentication' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          );
        }

        // Extend session
        const newExpiryTime = new Date(Date.now() + extensionMinutes * 60 * 1000);
        
        const { data: updatedSession, error } = await supabase
          .from('session_tracking')
          .update({
            expires_at: newExpiryTime.toISOString(),
            last_activity: new Date().toISOString()
          })
          .eq('session_token', sessionToken)
          .eq('user_id', user.id)
          .eq('is_active', true)
          .select()
          .single();

        if (error || !updatedSession) {
          return new Response(
            JSON.stringify({ error: 'Failed to extend session' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Log session extension
        await supabase.rpc('comprehensive_audit_log', {
          _action: 'session_extended',
          _resource_type: 'session',
          _resource_id: updatedSession.id,
          _new_data: {
            session_id: updatedSession.id,
            user_id: user.id,
            extension_minutes: extensionMinutes,
            new_expiry: newExpiryTime.toISOString()
          },
          _risk_level: 'low',
          _compliance_tags: ['session_management', 'session_extension']
        });

        console.log(`Session extended for user ${user.id}: ${extensionMinutes} minutes`);

        return new Response(
          JSON.stringify({
            success: true,
            new_expiry: newExpiryTime.toISOString(),
            extended_minutes: extensionMinutes
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'cleanup_sessions': {
        // Clean up all expired and inactive sessions
        const { data: cleanedSessions } = await supabase
          .rpc('cleanup_expired_sessions');

        console.log(`Cleaned up ${cleanedSessions || 0} expired sessions`);

        return new Response(
          JSON.stringify({
            success: true,
            cleaned_count: cleanedSessions || 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'force_logout': {
        const { userId, reason = 'administrative_action' } = data;
        
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: 'Authentication required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          );
        }

        const { data: { user: adminUser } } = await supabase.auth.getUser(
          authHeader.replace('Bearer ', '')
        );

        if (!adminUser) {
          return new Response(
            JSON.stringify({ error: 'Invalid authentication' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          );
        }

        // Verify admin privileges
        const { data: adminRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', adminUser.id)
          .single();

        if (adminRole?.role !== 'admin') {
          return new Response(
            JSON.stringify({ error: 'Admin privileges required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
          );
        }

        // Deactivate all user sessions
        const { data: deactivatedSessions } = await supabase
          .from('session_tracking')
          .update({ is_active: false })
          .eq('user_id', userId)
          .eq('is_active', true)
          .select();

        // Log forced logout
        await supabase.rpc('comprehensive_audit_log', {
          _action: 'forced_logout',
          _resource_type: 'user_session',
          _resource_id: userId,
          _new_data: {
            target_user_id: userId,
            admin_user_id: adminUser.id,
            reason: reason,
            sessions_terminated: deactivatedSessions?.length || 0
          },
          _risk_level: 'high',
          _compliance_tags: ['administrative_action', 'forced_logout', 'session_management']
        });

        console.log(`Forced logout for user ${userId} by admin ${adminUser.id}: ${reason}`);

        return new Response(
          JSON.stringify({
            success: true,
            sessions_terminated: deactivatedSessions?.length || 0,
            reason
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }

  } catch (error) {
    console.error('Session timeout manager error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});