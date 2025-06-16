
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

export class ReportService {
  static async generateThesesReport() {
    try {
      const { data: theses, error } = await supabase
        .from('theses')
        .select(`
          *,
          colleges (name),
          programs (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Prepare data for Excel
      const reportData = theses?.map(thesis => ({
        'Title': thesis.title,
        'Author': thesis.author,
        'College': thesis.colleges?.name || 'N/A',
        'Program': thesis.programs?.name || 'N/A',
        'Status': thesis.status,
        'Adviser': thesis.adviser || 'N/A',
        'Co-Adviser': thesis.co_adviser || 'N/A',
        'Keywords': Array.isArray(thesis.keywords) ? thesis.keywords.join(', ') : 'N/A',
        'View Count': thesis.view_count || 0,
        'Download Count': thesis.download_count || 0,
        'Upload Date': thesis.created_at ? new Date(thesis.created_at).toLocaleDateString() : 'N/A',
        'Publish Date': thesis.publish_date ? new Date(thesis.publish_date).toLocaleDateString() : 'N/A'
      })) || [];

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(reportData);

      // Auto-size columns
      const colWidths = Object.keys(reportData[0] || {}).map(key => ({ wch: 20 }));
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Theses Report');

      // Generate filename with current date
      const filename = `theses_report_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Download file
      XLSX.writeFile(wb, filename);

      return { success: true, message: 'Report generated successfully' };
    } catch (error: any) {
      console.error('Report generation error:', error);
      return { success: false, message: error.message || 'Failed to generate report' };
    }
  }

  static async generateCollegeReport(collegeId: string) {
    try {
      const { data: theses, error } = await supabase
        .from('theses')
        .select(`
          *,
          colleges (name),
          programs (name)
        `)
        .eq('college_id', collegeId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const reportData = theses?.map(thesis => ({
        'Title': thesis.title,
        'Author': thesis.author,
        'Program': thesis.programs?.name || 'N/A',
        'Status': thesis.status,
        'Adviser': thesis.adviser || 'N/A',
        'Keywords': Array.isArray(thesis.keywords) ? thesis.keywords.join(', ') : 'N/A',
        'Views': thesis.view_count || 0,
        'Downloads': thesis.download_count || 0,
        'Upload Date': thesis.created_at ? new Date(thesis.created_at).toLocaleDateString() : 'N/A'
      })) || [];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(reportData);
      const colWidths = Object.keys(reportData[0] || {}).map(() => ({ wch: 20 }));
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'College Theses');

      const collegeName = theses?.[0]?.colleges?.name || 'Unknown';
      const filename = `${collegeName}_theses_${new Date().toISOString().split('T')[0]}.xlsx`;

      XLSX.writeFile(wb, filename);

      return { success: true, message: 'College report generated successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to generate college report' };
    }
  }
}
