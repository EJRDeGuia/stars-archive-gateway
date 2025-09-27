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

    const { action, sessionData } = await req.json()
    console.log('Session manager action:', action)

    switch (action) {
      case 'create_session': {
        const { userId, deviceFingerprint, ipAddress, userAgent, locationData } = sessionData
        
        const { data, error } = await supabaseClient.rpc('create_user_session', {
          _user_id: userId,
          _session_token: crypto.randomUUID(),
          _device_fingerprint: deviceFingerprint,
          _ip_address: ipAddress,
          _user_agent: userAgent,
          _location_data: locationData
        })

        if (error) {
          console.error('Session creation error:', error)
          throw error
        }

        console.log('Session created successfully:', data)
        return new Response(JSON.stringify({ success: true, sessionId: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'terminate_session': {
        const { sessionId } = sessionData
        
        const { error } = await supabaseClient
          .from('session_tracking')
          .update({ is_active: false })
          .eq('id', sessionId)

        if (error) {
          console.error('Session termination error:', error)
          throw error
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'get_active_sessions': {
        const { data, error } = await supabaseClient
          .from('session_tracking')
          .select(`
            id, user_id, ip_address, user_agent, location_data,
            created_at, last_activity, session_type, expires_at
          `)
          .eq('is_active', true)
          .gt('expires_at', new Date().toISOString())
          .order('last_activity', { ascending: false })

        if (error) {
          console.error('Get sessions error:', error)
          throw error
        }

        return new Response(JSON.stringify({ success: true, sessions: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'update_activity': {
        const { sessionId } = sessionData
        
        const { error } = await supabaseClient
          .from('session_tracking')
          .update({ last_activity: new Date().toISOString() })
          .eq('id', sessionId)

        if (error) {
          console.error('Activity update error:', error)
          throw error
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

  } catch (error: unknown) {
    console.error('Session manager error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})