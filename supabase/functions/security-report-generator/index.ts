import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityReportRequest {
  action: 'generate_report' | 'download_report';
  data?: {
    startDate?: string;
    endDate?: string;
    reportType?: 'summary' | 'detailed' | 'compliance';
    format?: 'json' | 'csv' | 'pdf';
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

    // Verify admin access
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
      throw new Error('Admin privileges required for security reports');
    }

    const { action, data = {} }: SecurityReportRequest = await req.json();

    switch (action) {
      case 'generate_report': {
        const { startDate, endDate, reportType = 'summary' } = data;
        
        const start = startDate ? new Date(startDate).toISOString() : 
                     new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days ago
        const end = endDate ? new Date(endDate).toISOString() : new Date().toISOString();

        // Generate comprehensive security report
        const { data: reportData, error } = await supabaseClient
          .rpc('generate_security_report', {
            _start_date: start,
            _end_date: end
          });

        if (error) throw error;

        // Enhanced report with additional data
        const enhancedReport = {
          ...reportData,
          report_metadata: {
            generated_by: user.id,
            generated_by_email: user.email,
            report_type: reportType,
            system_version: '1.0.0',
            total_users: 0,
            total_active_sessions: 0
          }
        };

        // Get additional system metrics
        const { data: systemStats } = await supabaseClient
          .from('system_statistics')
          .select('*');

        if (systemStats) {
          const statsMap = systemStats.reduce((acc: any, stat: any) => {
            acc[stat.stat_key] = stat.stat_value;
            return acc;
          }, {});
          
          enhancedReport.report_metadata.total_users = statsMap.active_users || 0;
          enhancedReport.report_metadata.total_active_sessions = statsMap.active_sessions || 0;
        }

        // Log report generation
        await supabaseClient.rpc('comprehensive_audit_log', {
          _action: 'security_report_generated',
          _resource_type: 'system',
          _risk_level: 'medium',
          _compliance_tags: ['security_reporting', 'compliance_audit'],
          _additional_metadata: {
            report_type: reportType,
            date_range: { start, end },
            generated_by: user.email
          }
        });

        return new Response(JSON.stringify({
          success: true,
          report: enhancedReport
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'download_report': {
        const { startDate, endDate, format = 'json' } = data;
        
        const start = startDate ? new Date(startDate).toISOString() : 
                     new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const end = endDate ? new Date(endDate).toISOString() : new Date().toISOString();

        // Generate report data
        const { data: reportData, error } = await supabaseClient
          .rpc('generate_security_report', {
            _start_date: start,
            _end_date: end
          });

        if (error) throw error;

        let content: string;
        let contentType: string;
        let filename: string;

        switch (format) {
          case 'csv': {
            // Convert JSON to CSV format
            const csvData = [
              'Report Generated,Period Start,Period End,Total Alerts,Resolved Alerts,High Severity,Total Sessions,Unique Users,Failed Logins',
              `${reportData.report_generated_at},${reportData.report_period.start_date},${reportData.report_period.end_date},${reportData.security_alerts.total_alerts},${reportData.security_alerts.resolved_alerts},${reportData.security_alerts.high_severity},${reportData.session_activity.total_sessions},${reportData.session_activity.unique_users},${reportData.failed_logins.total_failed_attempts}`
            ].join('\n');
            
            content = csvData;
            contentType = 'text/csv';
            filename = `security_report_${new Date().toISOString().split('T')[0]}.csv`;
            break;
          }
          
          default: {
            content = JSON.stringify(reportData, null, 2);
            contentType = 'application/json';
            filename = `security_report_${new Date().toISOString().split('T')[0]}.json`;
            break;
          }
        }

        return new Response(content, {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${filename}"`,
          },
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
    console.error('Security report error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});