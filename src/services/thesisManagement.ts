
import { supabase } from '@/integrations/supabase/client';

export interface BulkActionResult {
  success: boolean;
  message: string;
  updatedCount?: number;
}

export class ThesisManagementService {
  // Check if user has admin privileges - updated to work with both development and production
  static async checkAdminAccess(userId: string): Promise<boolean> {
    try {
      // In development mode, we can also check localStorage for immediate access
      const isDevelopment = true; // This should match your auth context setting
      
      if (isDevelopment) {
        const storedUser = localStorage.getItem('stars_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          return userData.role === 'admin';
        }
      }

      // Always try to check the database as well
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking admin access:', error);
        return false;
      }
      
      return data?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  }

  // Bulk approve theses (admin only) - Fixed filtering logic
  static async bulkApprove(thesisIds: string[], userId: string): Promise<BulkActionResult> {
    try {
      // Check admin access first
      const isAdmin = await this.checkAdminAccess(userId);
      if (!isAdmin) {
        return {
          success: false,
          message: 'Only administrators can approve theses'
        };
      }

      console.log('Attempting to approve theses:', thesisIds);

      // Remove the status filter to allow approving from any status
      const { data, error } = await supabase
        .from('theses')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .in('id', thesisIds)
        .select();

      if (error) {
        console.error('Error approving theses:', error);
        throw error;
      }

      console.log('Approved theses result:', data);

      return {
        success: true,
        message: `Successfully approved ${data?.length || 0} ${data?.length === 1 ? 'thesis' : 'theses'}`,
        updatedCount: data?.length || 0
      };
    } catch (error: any) {
      console.error('Bulk approve error:', error);
      return {
        success: false,
        message: error.message || 'Failed to approve theses'
      };
    }
  }

  // Bulk reject theses (admin only) - Fixed filtering logic
  static async bulkReject(thesisIds: string[], userId: string): Promise<BulkActionResult> {
    try {
      // Check admin access first
      const isAdmin = await this.checkAdminAccess(userId);
      if (!isAdmin) {
        return {
          success: false,
          message: 'Only administrators can reject theses'
        };
      }

      console.log('Attempting to reject theses:', thesisIds);

      // Remove the status filter to allow rejecting from any status
      const { data, error } = await supabase
        .from('theses')
        .update({ 
          status: 'needs_revision',
          updated_at: new Date().toISOString()
        })
        .in('id', thesisIds)
        .select();

      if (error) {
        console.error('Error rejecting theses:', error);
        throw error;
      }

      console.log('Rejected theses result:', data);

      return {
        success: true,
        message: `Successfully rejected ${data?.length || 0} ${data?.length === 1 ? 'thesis' : 'theses'}`,
        updatedCount: data?.length || 0
      };
    } catch (error: any) {
      console.error('Bulk reject error:', error);
      return {
        success: false,
        message: error.message || 'Failed to reject theses'
      };
    }
  }

  // Move theses to collection (admin and archivist)
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

  // Delete theses (admin only)
  static async bulkDelete(thesisIds: string[], userId: string): Promise<BulkActionResult> {
    try {
      // Check admin access first
      const isAdmin = await this.checkAdminAccess(userId);
      if (!isAdmin) {
        return {
          success: false,
          message: 'Only administrators can delete theses'
        };
      }

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

  // Get pending theses for approval (admin only)
  static async getPendingTheses(userId: string) {
    try {
      // Check admin access first
      const isAdmin = await this.checkAdminAccess(userId);
      if (!isAdmin) {
        return { success: false, data: [], message: 'Access denied' };
      }

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
        .eq('status', 'pending_review')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, data: [], message: error.message };
    }
  }

  // Get all theses for management (admin and archivist can view, but only admin can approve/reject)
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
