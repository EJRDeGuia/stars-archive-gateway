
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from request
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      console.error('Authentication failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Authentication required' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const url = new URL(req.url);
    const thesisId = url.searchParams.get('thesisId');
    
    if (!thesisId) {
      return new Response(
        JSON.stringify({ error: 'Thesis ID is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user can access this thesis file using our secure function
    const { data: canAccess, error: accessError } = await supabaseClient
      .rpc('can_access_thesis_file', { 
        _thesis_id: thesisId,
        _user_id: user.id 
      });

    if (accessError) {
      console.error('Access check failed:', accessError);
      return new Response(
        JSON.stringify({ error: 'Access verification failed' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!canAccess) {
      // Log audit event for denied access
      await supabaseClient.rpc('log_audit_event', {
        _action: 'file_access_denied',
        _resource_type: 'thesis_file',
        _resource_id: thesisId,
        _details: { 
          user_id: user.id,
          reason: 'insufficient_permissions' 
        },
        _ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        _user_agent: req.headers.get('user-agent')
      });

      return new Response(
        JSON.stringify({ error: 'Access denied. Contact LRC for thesis access.' }), 
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Determine storage path
    const path = url.searchParams.get('path');

    // Get the thesis file from storage (prefer explicit path if provided)
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('thesis-pdfs')
      .download(path || `${thesisId}.pdf`);

    if (downloadError) {
      console.error('File download failed:', downloadError);
      return new Response(
        JSON.stringify({ error: 'File not found' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log successful file access
    await supabaseClient.rpc('log_audit_event', {
      _action: 'file_accessed',
      _resource_type: 'thesis_file',
      _resource_id: thesisId,
      _details: { 
        user_id: user.id,
        file_size: fileData.size 
      },
      _ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      _user_agent: req.headers.get('user-agent')
    });

    // Return the PDF with appropriate headers
    return new Response(fileData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="thesis.pdf"',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN'
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
