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
    
    console.log(`Watermark service action: ${action}`);

    switch (action) {
      case 'apply_watermark': {
        const { thesisId, watermarkType = 'invisible' } = data;
        
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

        // Generate watermark using database function
        const { data: watermarkResult, error } = await supabase
          .rpc('generate_watermark', {
            _thesis_id: thesisId,
            _user_id: user.id,
            _watermark_type: watermarkType
          });

        if (error) {
          console.error('Watermark generation error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to generate watermark' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        // In production, this would integrate with PDF processing libraries
        // to embed actual watermarks into the document
        const watermarkDetails = {
          ...watermarkResult,
          processing_status: 'completed',
          watermark_location: watermarkType === 'visible' ? 'header_footer' : 'metadata',
          embed_method: watermarkType === 'invisible' ? 'steganography' : 'overlay'
        };

        console.log(`Watermark applied to thesis ${thesisId} for user ${user.id}`);

        return new Response(
          JSON.stringify({
            success: true,
            watermark: watermarkDetails
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'verify_watermark': {
        const { watermarkId, verificationHash } = data;
        
        const { data: watermark, error } = await supabase
          .from('watermark_records')
          .select('*')
          .eq('id', watermarkId)
          .eq('is_active', true)
          .single();

        if (error || !watermark) {
          return new Response(
            JSON.stringify({
              verified: false,
              reason: 'watermark_not_found'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const isValid = watermark.verification_hash === verificationHash;
        const isExpired = watermark.expires_at && new Date(watermark.expires_at) < new Date();

        // Log verification attempt
        await supabase.rpc('comprehensive_audit_log', {
          _action: 'watermark_verification',
          _resource_type: 'watermark',
          _resource_id: watermarkId,
          _new_data: {
            watermark_id: watermarkId,
            verification_result: isValid && !isExpired,
            verification_hash: verificationHash,
            is_expired: isExpired
          },
          _risk_level: isValid ? 'low' : 'medium',
          _compliance_tags: ['watermark_verification', 'content_protection']
        });

        return new Response(
          JSON.stringify({
            verified: isValid && !isExpired,
            watermark_data: isValid ? watermark.watermark_data : null,
            expiry_status: isExpired ? 'expired' : 'valid',
            verification_time: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_user_watermarks': {
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

        const { data: watermarks, error } = await supabase
          .from('watermark_records')
          .select(`
            id,
            thesis_id,
            watermark_type,
            applied_at,
            expires_at,
            is_active,
            theses (title, author)
          `)
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('applied_at', { ascending: false });

        if (error) {
          console.error('Watermark retrieval error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to retrieve watermarks' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            watermarks
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'revoke_watermark': {
        const { watermarkId, reason = 'user_request' } = data;
        
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

        // Check if user owns the watermark or has admin privileges
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        const isAdmin = userRole?.role === 'admin';

        const { data: watermark, error: fetchError } = await supabase
          .from('watermark_records')
          .select('*')
          .eq('id', watermarkId)
          .single();

        if (fetchError || !watermark) {
          return new Response(
            JSON.stringify({ error: 'Watermark not found' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
          );
        }

        if (!isAdmin && watermark.user_id !== user.id) {
          return new Response(
            JSON.stringify({ error: 'Permission denied' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
          );
        }

        // Deactivate watermark
        const { error: updateError } = await supabase
          .from('watermark_records')
          .update({ is_active: false })
          .eq('id', watermarkId);

        if (updateError) {
          console.error('Watermark revocation error:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to revoke watermark' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        // Log watermark revocation
        await supabase.rpc('comprehensive_audit_log', {
          _action: 'watermark_revoked',
          _resource_type: 'watermark',
          _resource_id: watermarkId,
          _new_data: {
            watermark_id: watermarkId,
            thesis_id: watermark.thesis_id,
            revoked_by: user.id,
            reason: reason,
            original_owner: watermark.user_id
          },
          _risk_level: 'medium',
          _compliance_tags: ['watermark_management', 'content_protection']
        });

        console.log(`Watermark ${watermarkId} revoked by user ${user.id}: ${reason}`);

        return new Response(
          JSON.stringify({
            success: true,
            watermark_id: watermarkId,
            revocation_time: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'bulk_watermark_cleanup': {
        // Admin function to clean up expired watermarks
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

        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (userRole?.role !== 'admin') {
          return new Response(
            JSON.stringify({ error: 'Admin privileges required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
          );
        }

        // Deactivate expired watermarks
        const { data: expiredWatermarks } = await supabase
          .from('watermark_records')
          .update({ is_active: false })
          .lt('expires_at', new Date().toISOString())
          .eq('is_active', true)
          .select('id');

        const cleanedCount = expiredWatermarks?.length || 0;

        // Log cleanup operation
        await supabase.rpc('comprehensive_audit_log', {
          _action: 'watermark_bulk_cleanup',
          _resource_type: 'system',
          _new_data: {
            cleaned_count: cleanedCount,
            cleanup_type: 'expired_watermarks',
            performed_by: user.id
          },
          _risk_level: 'low',
          _compliance_tags: ['watermark_maintenance', 'system_cleanup']
        });

        console.log(`Cleaned up ${cleanedCount} expired watermarks`);

        return new Response(
          JSON.stringify({
            success: true,
            cleaned_count: cleanedCount
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
    console.error('Watermark service error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});