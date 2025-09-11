import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SecurityReportData {
  report_generated_at: string;
  report_period: {
    start_date: string;
    end_date: string;
  };
  security_alerts: {
    total_alerts: number;
    resolved_alerts: number;
    unresolved_alerts: number;
    high_severity: number;
    medium_severity: number;
    low_severity: number;
    alert_types: string[];
  };
  session_activity: {
    total_sessions: number;
    active_sessions: number;
    unique_users: number;
    unique_ips: number;
    average_session_duration: number;
  };
  failed_logins: {
    total_failed_attempts: number;
    unique_ips_blocked: number;
    most_targeted_emails: string[];
  };
  report_metadata?: {
    generated_by: string;
    generated_by_email: string;
    report_type: string;
    system_version: string;
    total_users: number;
    total_active_sessions: number;
  };
}

export const useSecurityReports = () => {
  // Generate security report
  const generateReport = useMutation({
    mutationFn: async (params: {
      startDate?: string;
      endDate?: string;
      reportType?: 'summary' | 'detailed' | 'compliance';
    } = {}) => {
      const { data, error } = await supabase.functions.invoke('security-report-generator', {
        body: { 
          action: 'generate_report',
          data: params
        }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.message);
      
      return data.report as SecurityReportData;
    },
    onSuccess: () => {
      toast.success('Security report generated successfully');
    },
    onError: (error: any) => {
      toast.error(`Report generation failed: ${error.message}`);
    }
  });

  // Download security report
  const downloadReport = useMutation({
    mutationFn: async (params: {
      startDate?: string;
      endDate?: string;
      format?: 'json' | 'csv' | 'pdf';
    } = {}) => {
      const { data, error } = await supabase.functions.invoke('security-report-generator', {
        body: { 
          action: 'download_report',
          data: params
        }
      });
      
      if (error) throw error;
      
      // Create and trigger download
      const blob = new Blob([data], { 
        type: params.format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security_report_${new Date().toISOString().split('T')[0]}.${params.format || 'json'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return data;
    },
    onSuccess: () => {
      toast.success('Security report downloaded successfully');
    },
    onError: (error: any) => {
      toast.error(`Download failed: ${error.message}`);
    }
  });

  return {
    generateReport: generateReport.mutate,
    downloadReport: downloadReport.mutate,
    isGenerating: generateReport.isPending,
    isDownloading: downloadReport.isPending,
    reportData: generateReport.data,
  };
};