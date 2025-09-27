import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, action = 'detect_all' } = await req.json()
    console.log('Anomaly detection for user:', userId)

    // Run anomaly detection using the existing database function
    const { error } = await supabaseClient.rpc('detect_user_anomalies', {
      _user_id: userId
    })

    if (error) {
      console.error('Anomaly detection error:', error)
      throw error
    }

    // Get recent security alerts for this user
    const { data: alerts, error: alertsError } = await supabaseClient
      .from('security_alerts')
      .select('*')
      .eq('user_id', userId)
      .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('created_at', { ascending: false })

    if (alertsError) {
      console.warn('Could not fetch alerts:', alertsError)
    }

    // Additional real-time checks
    const anomalies = []

    // Check for rapid successive logins
    const { data: recentSessions } = await supabaseClient
      .from('session_tracking')
      .select('created_at, ip_address')
      .eq('user_id', userId)
      .gt('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .order('created_at', { ascending: false })

    if (recentSessions && recentSessions.length >= 5) {
      anomalies.push({
        type: 'rapid_logins',
        severity: 'medium',
        description: `${recentSessions.length} login attempts in the last hour`,
        timestamp: new Date().toISOString()
      })
    }

    // Check for unusual access patterns
    const { data: downloads } = await supabaseClient
      .from('thesis_downloads')
      .select('downloaded_at')
      .eq('user_id', userId)
      .gt('downloaded_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour

    if (downloads && downloads.length >= 20) {
      anomalies.push({
        type: 'bulk_downloads',
        severity: 'high',
        description: `${downloads.length} downloads in the last hour - possible data extraction`,
        timestamp: new Date().toISOString()
      })
    }

    // Log the analysis
    await supabaseClient.rpc('log_audit_event', {
      _action: 'anomaly_detection_run',
      _resource_type: 'user',
      _resource_id: userId,
      _details: JSON.stringify({
        anomaliesFound: anomalies.length,
        anomalies: anomalies
      })
    })

    console.log(`Anomaly detection completed. Found ${anomalies.length} anomalies`)

    return new Response(JSON.stringify({
      success: true,
      anomalies: anomalies,
      recentAlerts: alerts || [],
      analyzed_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: unknown) {
    console.error('Anomaly detector error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})