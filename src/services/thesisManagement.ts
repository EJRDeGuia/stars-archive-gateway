
import { supabase } from '@/integrations/supabase/client';

export interface BulkActionResult {
  success: boolean;
  message: string;
  updatedCount?: number;
}

export class ThesisManagementService {
  // Check if user has admin privileges with enhanced logging
  static async checkAdminAccess(userId: string): Promise<boolean> {
    try {
      console.log('Checking admin access for user:', userId);
      
      // Check localStorage first for development
      const storedUser = localStorage.getItem('stars_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('Found stored user data:', userData);
        if (userData.role === 'admin') {
          console.log('User is admin according to localStorage');
          return true;
        }
      }

      // Check database
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      console.log('Database profile check result:', { data, error });

      if (error) {
        console.error('Error checking admin access:', error);
        return false;
      }
      
      const isAdmin = data?.role === 'admin';
      console.log('Is admin from database:', isAdmin);
      return isAdmin;
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  }

  // Approve a single thesis using the database function
  static async approveThesis(thesisId: string, userId: string): Promise<BulkActionResult> {
    try {
      console.log('Starting thesis approval for:', thesisId, 'by user:', userId);

      // Enhanced admin check first
      const isAdmin = await this.checkAdminAccess(userId);
      console.log('Admin access check result:', isAdmin);
      
      if (!isAdmin) {
        // Try alternative approach - check if user is in development mode
        const storedUser = localStorage.getItem('stars_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('Attempting development mode approval with user:', userData);
          
          if (userData.role === 'admin') {
            // For development, try direct database update
            console.log('Using development mode direct update');
            const { error } = await supabase
              .from('theses')
              .update({ 
                status: 'approved',
                updated_at: new Date().toISOString()
              })
              .eq('id', thesisId);

            if (error) {
              console.error('Direct update error:', error);
              return {
                success: false,
                message: `Database error: ${error.message}`
              };
            }

            return {
              success: true,
              message: 'Successfully approved thesis (development mode)',
              updatedCount: 1
            };
          }
        }
        
        return {
          success: false,
          message: 'Admin access denied. Please check your user role.'
        };
      }

      // Use the database function for safe status update
      const { data, error } = await supabase.rpc('update_thesis_status', {
        thesis_uuid: thesisId,
        new_status: 'approved',
        user_uuid: userId
      });

      console.log('Database function call result:', { data, error });

      if (error) {
        console.error('Database function error:', error);
        return {
          success: false,
          message: `Database error: ${error.message}`
        };
      }

      if (!data || data.length === 0) {
        return {
          success: false,
          message: 'No response from database function'
        };
      }

      const result = data[0];
      console.log('Database function result:', result);

      if (!result.success) {
        return {
          success: false,
          message: result.message || 'Failed to approve thesis'
        };
      }

      return {
        success: true,
        message: result.message || `Successfully approved "${result.thesis_title}"`,
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

  // Reject a single thesis using the database function
  static async rejectThesis(thesisId: string, userId: string): Promise<BulkActionResult> {
    try {
      console.log('Starting thesis rejection for:', thesisId, 'by user:', userId);

      // Enhanced admin check first
      const isAdmin = await this.checkAdminAccess(userId);
      console.log('Admin access check result:', isAdmin);
      
      if (!isAdmin) {
        // Try alternative approach - check if user is in development mode
        const storedUser = localStorage.getItem('stars_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('Attempting development mode rejection with user:', userData);
          
          if (userData.role === 'admin') {
            // For development, try direct database update
            console.log('Using development mode direct update');
            const { error } = await supabase
              .from('theses')
              .update({ 
                status: 'needs_revision',
                updated_at: new Date().toISOString()
              })
              .eq('id', thesisId);

            if (error) {
              console.error('Direct update error:', error);
              return {
                success: false,
                message: `Database error: ${error.message}`
              };
            }

            return {
              success: true,
              message: 'Successfully rejected thesis (development mode)',
              updatedCount: 1
            };
          }
        }
        
        return {
          success: false,
          message: 'Admin access denied. Please check your user role.'
        };
      }

      // Use the database function for safe status update
      const { data, error } = await supabase.rpc('update_thesis_status', {
        thesis_uuid: thesisId,
        new_status: 'needs_revision',
        user_uuid: userId
      });

      console.log('Database function call result:', { data, error });

      if (error) {
        console.error('Database function error:', error);
        return {
          success: false,
          message: `Database error: ${error.message}`
        };
      }

      if (!data || data.length === 0) {
        return {
          success: false,
          message: 'No response from database function'
        };
      }

      const result = data[0];
      console.log('Database function result:', result);

      if (!result.success) {
        return {
          success: false,
          message: result.message || 'Failed to reject thesis'
        };
      }

      return {
        success: true,
        message: result.message || `Successfully rejected "${result.thesis_title}"`,
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
