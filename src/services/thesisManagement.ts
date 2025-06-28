
import { supabase } from '@/integrations/supabase/client';

export interface BulkActionResult {
  success: boolean;
  message: string;
  updatedCount?: number;
}

export class ThesisManagementService {
  // Bulk approve theses
  static async bulkApprove(thesisIds: string[]): Promise<BulkActionResult> {
    try {
      const { data, error } = await supabase
        .from('theses')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .in('id', thesisIds)
        .select();

      if (error) throw error;

      return {
        success: true,
        message: `Successfully approved ${data?.length || 0} theses`,
        updatedCount: data?.length || 0
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to approve theses'
      };
    }
  }

  // Bulk reject theses
  static async bulkReject(thesisIds: string[]): Promise<BulkActionResult> {
    try {
      const { data, error } = await supabase
        .from('theses')
        .update({ 
          status: 'needs_revision',
          updated_at: new Date().toISOString()
        })
        .in('id', thesisIds)
        .select();

      if (error) throw error;

      return {
        success: true,
        message: `Successfully rejected ${data?.length || 0} theses`,
        updatedCount: data?.length || 0
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to reject theses'
      };
    }
  }

  // Move theses to collection
  static async moveToCollection(thesisIds: string[], collectionId: string): Promise<BulkActionResult> {
    try {
      // First, remove existing entries for these theses in the target collection
      await supabase
        .from('collection_theses')
        .delete()
        .in('thesis_id', thesisIds)
        .eq('collection_id', collectionId);

      // Then insert new entries
      const insertData = thesisIds.map(thesisId => ({
        thesis_id: thesisId,
        collection_id: collectionId
      }));

      const { data, error } = await supabase
        .from('collection_theses')
        .insert(insertData)
        .select();

      if (error) throw error;

      return {
        success: true,
        message: `Successfully moved ${data?.length || 0} theses to collection`,
        updatedCount: data?.length || 0
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to move theses to collection'
      };
    }
  }

  // Delete theses
  static async bulkDelete(thesisIds: string[]): Promise<BulkActionResult> {
    try {
      const { error } = await supabase
        .from('theses')
        .delete()
        .in('id', thesisIds);

      if (error) throw error;

      return {
        success: true,
        message: `Successfully deleted ${thesisIds.length} theses`,
        updatedCount: thesisIds.length
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to delete theses'
      };
    }
  }

  // Get collections for selection
  static async getCollections() {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('is_public', true)
        .order('name');

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, data: [], message: error.message };
    }
  }

  // Get all theses for management (including non-approved ones for admins/archivists)
  static async getAllTheses() {
    try {
      const { data, error } = await supabase
        .from('theses')
        .select(`
          *,
          colleges (
            id,
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, data: [], message: error.message };
    }
  }
}
