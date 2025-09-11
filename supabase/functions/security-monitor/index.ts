import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, data } = await req.json();
    
    // Get client IP
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';

    console.log(`Security monitor action: ${action} from IP: ${clientIP}`);

    switch (action) {
      case 'validate_session': {
        const { sessionToken, userAgent } = data;
        
        // Validate session security
        const { data: validationResult, error } = await supabase
          .rpc('validate_session_security', {
            _session_token: sessionToken,
            _current_ip: clientIP,
            _current_user_agent: userAgent
          });

        if (error) {
          console.error('Session validation error:', error);
          return new Response(
            JSON.stringify({ error: 'Session validation failed' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            validation: validationResult 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'check_ip_reputation': {
        const { data: reputationData, error } = await supabase
          .rpc('check_ip_reputation', {
            _ip_address: clientIP
          });

        if (error) {
          console.error('IP reputation check error:', error);
          return new Response(
            JSON.stringify({ error: 'IP reputation check failed' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        // Log suspicious IPs
        if (reputationData.reputation_score < 30) {
          await supabase
            .from('security_alerts')
            .insert({
              alert_type: 'suspicious_ip',
              severity: 'medium',
              title: 'Suspicious IP Access',
              description: `Low reputation IP (${reputationData.reputation_score}) accessed system: ${clientIP}`,
              metadata: {
                ip_address: clientIP,
                reputation_data: reputationData,
                user_agent: req.headers.get('user-agent')
              },
              ip_address: clientIP
            });
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            reputation: reputationData 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'rate_limit_check': {
        const { action: rateLimitAction, limit = 100, windowMinutes = 60 } = data;
        
        const { data: rateLimitResult, error } = await supabase
          .rpc('check_rate_limit', {
            _identifier: clientIP,
            _action: rateLimitAction,
            _limit: limit,
            _window_minutes: windowMinutes
          });

        if (error) {
          console.error('Rate limit check error:', error);
          return new Response(
            JSON.stringify({ error: 'Rate limit check failed' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            rateLimit: rateLimitResult 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'log_security_event': {
        const { eventType, severity = 'medium', title, description, metadata = {} } = data;
        
        const authHeader = req.headers.get('Authorization');
        let userId = null;
        
        if (authHeader) {
          const { data: { user } } = await supabase.auth.getUser(
            authHeader.replace('Bearer ', '')
          );
          userId = user?.id;
        }

        // Log security event
        const { error } = await supabase
          .from('security_alerts')
          .insert({
            user_id: userId,
            alert_type: eventType,
            severity,
            title,
            description,
            metadata: {
              ...metadata,
              ip_address: clientIP,
              user_agent: req.headers.get('user-agent'),
              timestamp: new Date().toISOString()
            },
            ip_address: clientIP
          });

        if (error) {
          console.error('Security event logging error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to log security event' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'detect_anomalies': {
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

        // Run anomaly detection
        const { error } = await supabase
          .rpc('detect_user_anomalies', {
            _user_id: user.id
          });

        if (error) {
          console.error('Anomaly detection error:', error);
          return new Response(
            JSON.stringify({ error: 'Anomaly detection failed' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_security_dashboard': {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: 'Authentication required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          );
        }

        // Get recent security alerts
        const { data: alerts, error: alertsError } = await supabase
          .from('security_alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        // Get failed login attempts (last 24 hours)
        const { data: failedLogins, error: loginsError } = await supabase
          .from('failed_login_attempts')
          .select('*')
          .gte('attempted_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('attempted_at', { ascending: false });

        // Get active sessions count
        const { count: activeSessions, error: sessionsError } = await supabase
          .from('session_tracking')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .gt('expires_at', new Date().toISOString());

        if (alertsError || loginsError || sessionsError) {
          console.error('Security dashboard error:', { alertsError, loginsError, sessionsError });
          return new Response(
            JSON.stringify({ error: 'Failed to fetch security dashboard' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              alerts: alerts || [],
              failedLogins: failedLogins || [],
              activeSessions: activeSessions || 0,
              timestamp: new Date().toISOString()
            }
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
    console.error('Security monitor error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});