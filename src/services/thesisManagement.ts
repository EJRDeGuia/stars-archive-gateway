
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

export interface BulkActionResult {
  success: boolean;
  message: string;
  updatedCount?: number;
}

// Development mode flag - should match the one in AuthContext
const isDevelopment = false;

export class ThesisManagementService {
  // Check if user has admin privileges with enhanced logging
  static async checkAdminAccess(userId: string): Promise<boolean> {
    try {
      console.log('Checking admin access for user:', userId);
      
      if (isDevelopment) {
        // In development mode, check localStorage for the current user
        const storedUser = localStorage.getItem('stars_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('Found stored user data:', userData);
          console.log('User role from localStorage:', userData.role);
          
          // Check if the user ID matches and has admin role
          const isAdmin = userData.id === userId && userData.role === 'admin';
          console.log('Is admin (development mode):', isAdmin);
          return isAdmin;
        } else {
          console.log('No stored user found in localStorage');
          return false;
        }
      } else {
        // Production mode - use Supabase session and user_roles table
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Current session:', session, 'Session error:', sessionError);

        if (session?.user) {
          console.log('Session user ID:', session.user.id);
          console.log('Provided user ID:', userId);
          
          const actualUserId = session.user.id;
          
          // Check user role using the has_role function
          const { data, error } = await supabase.rpc('has_role', {
            _user_id: actualUserId,
            _role: 'admin'
          });

          console.log('has_role function result:', { data, error });

          if (error) {
            console.error('Error checking admin access:', error);
            return false;
          }
          
          console.log('Is admin from database:', data);
          return data === true;
        } else {
          console.log('No active session found');
          return false;
        }
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  }

  // Get current user session (works in both dev and production)
  static async getCurrentUserSession() {
    if (isDevelopment) {
      const storedUser = localStorage.getItem('stars_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return {
          user: {
            id: userData.id,
            email: userData.email
          }
        };
      }
      return { user: null };
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      return { user: session?.user || null };
    }
  }

  // Ensure user role exists in database for development mode
  static async ensureUserRoleExists(userId: string, userEmail: string) {
    if (isDevelopment) {
      // Check if user role exists
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!existingRole) {
        console.log('Creating user role for development user:', userId);
        
        // Get user data from localStorage to determine role
        const storedUser = localStorage.getItem('stars_user');
        let role: UserRole = 'researcher'; // default role with proper typing
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          role = (userData.role as UserRole) || 'researcher';
        }

        const { data: newRole, error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: role
          })
          .select()
          .single();

        console.log('User role creation result:', { newRole, error });
        return newRole;
      }
      
      return existingRole;
    }
    return null;
  }

  // Approve a single thesis using the database function
  static async approveThesis(thesisId: string, userId: string): Promise<BulkActionResult> {
    try {
      console.log('Starting thesis approval for:', thesisId, 'by user:', userId);

      // Get current user session (development or production)
      const { user } = await this.getCurrentUserSession();
      
      if (!user) {
        return {
          success: false,
          message: 'No active user session found'
        };
      }

      const actualUserId = user.id;
      console.log('Using actual user ID:', actualUserId);

      // In development mode, ensure the user role exists in the database
      if (isDevelopment) {
        await this.ensureUserRoleExists(actualUserId, user.email || '');
      }

      // Enhanced admin check
      const isAdmin = await this.checkAdminAccess(actualUserId);
      console.log('Admin access check result:', isAdmin);
      
      if (!isAdmin) {
        return {
          success: false,
          message: 'Admin access denied. Please check your user role.'
        };
      }

      // Use the database function for secure status update
      console.log('Calling database function to update thesis status...');
      
      const { data, error } = await supabase.rpc('update_thesis_status', {
        thesis_uuid: thesisId,
        new_status: 'approved',
        user_uuid: actualUserId
      });

      console.log('Database function result:', { data, error });

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
          message: 'No thesis was updated. Please check if the thesis exists.'
        };
      }

      const result = data[0];
      
      if (result.success) {
        return {
          success: true,
          message: `Successfully approved thesis "${result.thesis_title}"`,
          updatedCount: 1
        };
      } else {
        return {
          success: false,
          message: result.message
        };
      }

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

      // Get current user session (development or production)
      const { user } = await this.getCurrentUserSession();
      
      if (!user) {
        return {
          success: false,
          message: 'No active user session found'
        };
      }

      const actualUserId = user.id;
      console.log('Using actual user ID:', actualUserId);

      // In development mode, ensure the user role exists in the database
      if (isDevelopment) {
        await this.ensureUserRoleExists(actualUserId, user.email || '');
      }

      // Enhanced admin check
      const isAdmin = await this.checkAdminAccess(actualUserId);
      console.log('Admin access check result:', isAdmin);
      
      if (!isAdmin) {
        return {
          success: false,
          message: 'Admin access denied. Please check your user role.'
        };
      }

      // Use the database function for secure status update
      console.log('Calling database function to update thesis status...');
      
      const { data, error } = await supabase.rpc('update_thesis_status', {
        thesis_uuid: thesisId,
        new_status: 'needs_revision',
        user_uuid: actualUserId
      });

      console.log('Database function result:', { data, error });

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
          message: 'No thesis was updated. Please check if the thesis exists.'
        };
      }

      const result = data[0];
      
      if (result.success) {
        return {
          success: true,
          message: `Successfully rejected thesis "${result.thesis_title}"`,
          updatedCount: 1
        };
      } else {
        return {
          success: false,
          message: result.message
        };
      }

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
