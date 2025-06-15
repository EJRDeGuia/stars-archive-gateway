
import { API_ENDPOINTS } from '@/utils/constants';
import { supabase } from '@/integrations/supabase/client';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-api.com' 
      : 'http://localhost:3001';
  }

  // Auth methods - using Supabase directly instead of mock API
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  }

  // Thesis methods - using Supabase directly
  async getTheses(params?: { page?: number; limit?: number; search?: string }) {
    let query = supabase
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

    if (params?.search) {
      query = query.or(`title.ilike.%${params.search}%,author.ilike.%${params.search}%,abstract.ilike.%${params.search}%`);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getThesis(id: string) {
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
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createThesis(thesisData: any) {
    const { data, error } = await supabase
      .from('theses')
      .insert([thesisData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateThesis(id: string, thesis: Partial<any>) {
    const { data, error } = await supabase
      .from('theses')
      .update(thesis)
      .eq('id', id)
      .select()
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
    return { success: true };
  }

  // Search methods - using Supabase
  async search(query: string, filters?: any) {
    let supabaseQuery = supabase
      .from('theses')
      .select(`
        *,
        colleges (
          id,
          name,
          description
        )
      `);

    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,author.ilike.%${query}%,abstract.ilike.%${query}%`);
    }

    if (filters?.college) {
      supabaseQuery = supabaseQuery.eq('college_id', filters.college);
    }

    const { data, error } = await supabaseQuery;
    if (error) throw error;
    return data;
  }

  // College methods - using Supabase
  async getColleges() {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  async getCollegeTheses(collegeId: string) {
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
      .eq('college_id', collegeId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

export const apiService = new ApiService();
