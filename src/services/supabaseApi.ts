
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type College = Database['public']['Tables']['colleges']['Row'];
type Thesis = Database['public']['Tables']['theses']['Row'];
type Program = Database['public']['Tables']['programs']['Row'];

export class SupabaseApiService {
  // Auth methods
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  async getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, colleges(*)')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateUserProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // College methods
  async getColleges(): Promise<College[]> {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async getCollegeById(id: string): Promise<College | null> {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createCollege(college: Omit<College, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('colleges')
      .insert(college)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateCollege(id: string, updates: Partial<College>) {
    const { data, error } = await supabase
      .from('colleges')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteCollege(id: string) {
    const { error } = await supabase
      .from('colleges')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Program methods
  async getPrograms(): Promise<Program[]> {
    const { data, error } = await supabase
      .from('programs')
      .select('*, colleges(*)')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async getProgramsByCollege(collegeId: string): Promise<Program[]> {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('college_id', collegeId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  // Thesis methods
  async getTheses(params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
    collegeId?: string;
    status?: string;
  }) {
    let query = supabase
      .from('theses')
      .select(`
        *,
        colleges(*),
        programs(*)
      `);

    // Apply filters
    if (params?.search) {
      query = query.or(`title.ilike.%${params.search}%,author.ilike.%${params.search}%,abstract.ilike.%${params.search}%`);
    }

    if (params?.collegeId) {
      query = query.eq('college_id', params.collegeId);
    }

    if (params?.status) {
      query = query.eq('status', params.status);
    }

    // Apply pagination
    const limit = params?.limit || 20;
    const offset = ((params?.page || 1) - 1) * limit;
    
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: data || [],
      count: count || 0,
      page: params?.page || 1,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  async getThesis(id: string) {
    const { data, error } = await supabase
      .from('theses')
      .select(`
        *,
        colleges(*),
        programs(*)
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createThesis(thesis: Omit<Thesis, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('theses')
      .insert(thesis)
      .select(`
        *,
        colleges(*),
        programs(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async updateThesis(id: string, updates: Partial<Thesis>) {
    const { data, error } = await supabase
      .from('theses')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        colleges(*),
        programs(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async deleteThesis(id: string) {
    const { error } = await supabase
      .from('theses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Analytics methods
  async recordThesisView(thesisId: string, userId?: string) {
    const { error } = await supabase
      .from('thesis_views')
      .insert({
        thesis_id: thesisId,
        user_id: userId || null
      });

    if (error) throw error;

    // Update view count
    await supabase.rpc('increment_view_count', { thesis_id: thesisId });
  }

  async recordThesisDownload(thesisId: string, userId?: string) {
    const { error } = await supabase
      .from('thesis_downloads')
      .insert({
        thesis_id: thesisId,
        user_id: userId || null
      });

    if (error) throw error;

    // Update download count
    await supabase.rpc('increment_download_count', { thesis_id: thesisId });
  }

  // User management methods (admin only)
  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        colleges(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateUserRole(userId: string, role: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: role as any })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Search methods
  async searchTheses(query: string, filters?: any) {
    let supabaseQuery = supabase
      .from('theses')
      .select(`
        *,
        colleges(*),
        programs(*)
      `)
      .eq('status', 'approved');

    // Full-text search across multiple fields
    if (query) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,author.ilike.%${query}%,abstract.ilike.%${query}%,keywords.cs.{${query}}`
      );
    }

    // Apply additional filters
    if (filters?.collegeId) {
      supabaseQuery = supabaseQuery.eq('college_id', filters.collegeId);
    }

    if (filters?.year) {
      supabaseQuery = supabaseQuery.gte('publish_date', `${filters.year}-01-01`)
                                   .lte('publish_date', `${filters.year}-12-31`);
    }

    const { data, error } = await supabaseQuery
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  }
}

export const supabaseApi = new SupabaseApiService();
