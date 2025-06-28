import { supabase } from '@/integrations/supabase/client';

export interface BulkActionResult {
  success: boolean;
  message: string;
  updatedCount?: number;
}

export class ThesisManagementService {
  // Check if user has admin privileges
  static async checkAdminAccess(userId: string): Promise<boolean> {
    try {
      // Check localStorage first for development
      const storedUser = localStorage.getItem('stars_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.role === 'admin') {
          return true;
        }
      }

      // Check database
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking admin access:', error);
        return false;
      }
      
      return data?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  }

  // Approve a single thesis
  static async approveThesis(thesisId: string, userId: string): Promise<BulkActionResult> {
    try {
      console.log('Starting thesis approval for:', thesisId, 'by user:', userId);

      // Check admin access
      const isAdmin = await this.checkAdminAccess(userId);
      if (!isAdmin) {
        console.log('User is not admin:', userId);
        return {
          success: false,
          message: 'Only administrators can approve theses'
        };
      }

      // Check if thesis exists
      const { data: thesis, error: fetchError } = await supabase
        .from('theses')
        .select('id, title, status')
        .eq('id', thesisId)
        .single();

      if (fetchError || !thesis) {
        console.error('Thesis not found:', fetchError);
        return {
          success: false,
          message: 'Thesis not found'
        };
      }

      console.log('Found thesis:', thesis);

      // Update thesis status
      const { data: updatedThesis, error: updateError } = await supabase
        .from('theses')
        .update({ status: 'approved' })
        .eq('id', thesisId)
        .select('id, title, status')
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        return {
          success: false,
          message: `Failed to approve thesis: ${updateError.message}`
        };
      }

      console.log('Successfully updated thesis:', updatedThesis);

      return {
        success: true,
        message: `Successfully approved "${thesis.title}"`,
        updatedCount: 1
      };
    } catch (error: any) {
      console.error('Approval error:', error);
      return {
        success: false,
        message: error.message || 'Failed to approve thesis'
      };
    }
  }

  // Reject a single thesis
  static async rejectThesis(thesisId: string, userId: string): Promise<BulkActionResult> {
    try {
      console.log('Starting thesis rejection for:', thesisId, 'by user:', userId);

      // Check admin access
      const isAdmin = await this.checkAdminAccess(userId);
      if (!isAdmin) {
        console.log('User is not admin:', userId);
        return {
          success: false,
          message: 'Only administrators can reject theses'
        };
      }

      // Check if thesis exists
      const { data: thesis, error: fetchError } = await supabase
        .from('theses')
        .select('id, title, status')
        .eq('id', thesisId)
        .single();

      if (fetchError || !thesis) {
        console.error('Thesis not found:', fetchError);
        return {
          success: false,
          message: 'Thesis not found'
        };
      }

      console.log('Found thesis:', thesis);

      // Update thesis status
      const { data: updatedThesis, error: updateError } = await supabase
        .from('theses')
        .update({ status: 'needs_revision' })
        .eq('id', thesisId)
        .select('id, title, status')
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        return {
          success: false,
          message: `Failed to reject thesis: ${updateError.message}`
        };
      }

      console.log('Successfully updated thesis:', updatedThesis);

      return {
        success: true,
        message: `Successfully rejected "${thesis.title}"`,
        updatedCount: 1
      };
    } catch (error: any) {
      console.error('Rejection error:', error);
      return {
        success: false,
        message: error.message || 'Failed to reject thesis'
      };
    }
  }

  // Legacy bulk methods for backward compatibility
  static async bulkApprove(thesisIds: string[], userId: string): Promise<BulkActionResult> {
    if (thesisIds.length === 1) {
      return this.approveThesis(thesisIds[0], userId);
    }
    
    // Handle multiple theses
    let successCount = 0;
    let lastError = '';

    for (const thesisId of thesisIds) {
      const result = await this.approveThesis(thesisId, userId);
      if (result.success) {
        successCount++;
      } else {
        lastError = result.message;
      }
    }

    return {
      success: successCount > 0,
      message: successCount > 0 
        ? `Successfully approved ${successCount} ${successCount === 1 ? 'thesis' : 'theses'}`
        : lastError || 'Failed to approve theses',
      updatedCount: successCount
    };
  }

  static async bulkReject(thesisIds: string[], userId: string): Promise<BulkActionResult> {
    if (thesisIds.length === 1) {
      return this.rejectThesis(thesisIds[0], userId);
    }
    
    // Handle multiple theses
    let successCount = 0;
    let lastError = '';

    for (const thesisId of thesisIds) {
      const result = await this.rejectThesis(thesisId, userId);
      if (result.success) {
        successCount++;
      } else {
        lastError = result.message;
      }
    }

    return {
      success: successCount > 0,
      message: successCount > 0 
        ? `Successfully rejected ${successCount} ${successCount === 1 ? 'thesis' : 'theses'}`
        : lastError || 'Failed to reject theses',
      updatedCount: successCount
    };
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
