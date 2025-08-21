
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ThesisUploadData {
  title: string;
  author: string;
  coAdviser?: string;
  adviser: string;
  collegeId: string;
  abstract: string;
  keywords: string[];
  publishYear: number;
  fileUrl: string;
  uploadedBy: string;
}

export class UploadService {
  private static async validateUploadPermissions(userId: string): Promise<boolean> {
    try {
      // Use the secure has_role function to check archivist permissions
      const { data, error } = await supabase
        .rpc('has_role', { 
          _user_id: userId, 
          _role: 'archivist' 
        });

      if (error) {
        console.error('[UploadService] Permission check error:', error);
        return false;
      }

      // Also check for admin role as fallback
      if (!data) {
        const { data: isAdmin, error: adminError } = await supabase
          .rpc('has_role', { 
            _user_id: userId, 
            _role: 'admin' 
          });

        if (adminError) {
          console.error('[UploadService] Admin permission check error:', adminError);
          return false;
        }

        return isAdmin === true;
      }

      return data === true;
    } catch (error) {
      console.error('[UploadService] Permission validation failed:', error);
      return false;
    }
  }

  private static createThesisPayload(data: ThesisUploadData) {
    return {
      title: data.title.trim(),
      author: data.author.trim(),
      co_adviser: data.coAdviser?.trim() || null,
      adviser: data.adviser.trim(),
      college_id: data.collegeId,
      program_id: null,
      abstract: data.abstract.trim(),
      keywords: data.keywords.filter(k => k.length > 0),
      publish_date: `${data.publishYear}-01-01`,
      file_url: data.fileUrl,
      status: "pending_review" as const,
      uploaded_by: data.uploadedBy,
    };
  }

  public static async uploadThesis(data: ThesisUploadData): Promise<{ success: boolean; thesis?: any; error?: string }> {
    try {
      console.log('[UploadService] 1. Starting upload thesis...');
      
      // Check permissions first - only archivists can upload
      console.log('[UploadService] 2. Checking archivist permissions for user:', data.uploadedBy);
      const hasPermission = await this.validateUploadPermissions(data.uploadedBy);
      console.log('[UploadService] 3. Permission check result:', hasPermission);
      
      if (!hasPermission) {
        // Log unauthorized upload attempt
        await supabase.rpc('log_audit_event', {
          _action: 'unauthorized_upload_attempt',
          _resource_type: 'thesis',
          _details: { 
            title: data.title,
            user_id: data.uploadedBy,
            reason: 'insufficient_permissions'
          }
        });

        return {
          success: false,
          error: "Only archivists can upload theses. Please contact an administrator if you need upload permissions."
        };
      }

      console.log('[UploadService] 4. Starting thesis upload with data:', {
        title: data.title,
        author: data.author,
        college_id: data.collegeId,
        user_id: data.uploadedBy
      });

      // Create optimized payload
      console.log('[UploadService] 5. Creating payload...');
      const payload = this.createThesisPayload(data);
      console.log('[UploadService] 6. Payload created:', payload);

      // Perform the database insertion
      console.log('[UploadService] 7. Starting database insertion...');
      const { data: insertedThesis, error: insertError } = await supabase
        .from("theses")
        .insert(payload)
        .select()
        .single();

      console.log('[UploadService] 8. Database insertion completed.');
      console.log('[UploadService] 9. Insert error:', insertError);
      console.log('[UploadService] 10. Insert result:', insertedThesis);

      if (insertError) {
        console.error('[UploadService] Database insertion error:', insertError);
        
        // Log failed upload
        await supabase.rpc('log_audit_event', {
          _action: 'thesis_upload_failed',
          _resource_type: 'thesis',
          _details: { 
            title: data.title,
            error: insertError.message,
            user_id: data.uploadedBy
          }
        });

        return {
          success: false,
          error: `Failed to save thesis: ${insertError.message}`
        };
      }

      // Log successful upload
      await supabase.rpc('log_audit_event', {
        _action: 'thesis_uploaded',
        _resource_type: 'thesis',
        _resource_id: insertedThesis.id,
        _details: { 
          title: insertedThesis.title,
          author: insertedThesis.author,
          college_id: insertedThesis.college_id,
          uploader_id: data.uploadedBy
        }
      });

      console.log('[UploadService] Thesis uploaded successfully:', insertedThesis.id);

      return {
        success: true,
        thesis: insertedThesis
      };

    } catch (error: any) {
      console.error('[UploadService] Upload failed:', error);
      
      // Log upload error
      try {
        await supabase.rpc('log_audit_event', {
          _action: 'thesis_upload_error',
          _resource_type: 'thesis',
          _details: { 
            title: data.title,
            error: error?.message || 'Unknown error',
            user_id: data.uploadedBy
          }
        });
      } catch (auditError) {
        console.warn('[UploadService] Audit logging failed:', auditError);
      }

      return {
        success: false,
        error: error?.message || "Unexpected error occurred during upload"
      };
    }
  }

  public static getFileUrl(storagePath: string): string {
    try {
      // Return the secure function URL instead of direct storage URL
      const thesisId = storagePath.replace('.pdf', '');
      return `${supabase.supabaseUrl}/functions/v1/secure-thesis-access?thesisId=${thesisId}`;
    } catch (error) {
      console.error('[UploadService] Error getting secure file URL:', error);
      throw new Error("Failed to get secure file URL");
    }
  }

  public static async getCollegeMapping(): Promise<Record<string, string>> {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('id, name');
        
      if (error) {
        console.error('[UploadService] Error fetching colleges:', error);
        throw new Error(`Could not fetch colleges: ${error.message}`);
      }
      
      // Build a map from college name to UUID
      const nameToUuid: Record<string, string> = {};
      const collegeNames = ['CITE', 'CBEAM', 'CEAS', 'CON', 'CIHTM'];
      
      collegeNames.forEach(name => {
        const found = data?.find((d: any) => d.name === name);
        if (found) nameToUuid[name.toLowerCase()] = found.id;
      });
      
      console.log('[UploadService] College mapping loaded:', nameToUuid);
      return nameToUuid;
      
    } catch (error) {
      console.error('[UploadService] Failed to fetch colleges:', error);
      throw error;
    }
  }
}
