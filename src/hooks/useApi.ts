
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { supabase } from "@/integrations/supabase/client";

// Generic hook for API queries
export function useApiQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: any
) {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}

// Generic hook for API mutations
export function useApiMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options?: any
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn,
    onSuccess: () => {
      // Invalidate relevant queries after successful mutation
      if (options?.invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: options.invalidateQueries });
      }
    },
    ...options,
  });
}

// Specific hooks for common operations
export function useTheses(params?: { page?: number; limit?: number; search?: string; includeAll?: boolean }) {
  return useQuery({
    queryKey: ['theses', JSON.stringify(params)],
    queryFn: async () => {
      console.log('[useTheses] Fetching theses with params:', params);
      
      let query = supabase
        .from('theses')
        .select(`
          *,
          colleges (
            id,
            name,
            description
          )
        `);

      // Only show approved theses unless specifically requesting all
      if (!params?.includeAll) {
        query = query.eq('status', 'approved');
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('[useTheses] Error fetching theses:', error);
        throw error;
      }
      
      console.log('[useTheses] Successfully fetched theses:', data);
      return data || [];
    },
  });
}

export function useThesis(id: string) {
  return useApiQuery(
    ['thesis', id],
    () => apiService.getThesis(id),
    { enabled: !!id }
  );
}

export function useCreateThesis() {
  return useApiMutation(
    (thesis: FormData) => apiService.createThesis(thesis),
    { invalidateQueries: ['theses'] }
  );
}

export function useUpdateThesis() {
  return useApiMutation(
    ({ id, thesis }: { id: string; thesis: any }) => apiService.updateThesis(id, thesis),
    { invalidateQueries: ['theses'] }
  );
}

export function useDeleteThesis() {
  return useApiMutation(
    (id: string) => apiService.deleteThesis(id),
    { invalidateQueries: ['theses'] }
  );
}

export function useSearch() {
  return useApiMutation(
    ({ query, filters }: { query: string; filters?: any }) => apiService.search(query, filters)
  );
}

export function useColleges() {
  return useQuery({
    queryKey: ['colleges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });
}

// User Favorites Hooks
export function useUserFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: ["user_favorites", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("user_favorites")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      thesisId,
      favoriteId,
    }: { userId: string; thesisId: string; favoriteId?: string }) => {
      if (favoriteId) {
        // Remove
        const { error } = await supabase
          .from("user_favorites")
          .delete()
          .eq("id", favoriteId);
        if (error) throw error;
        return { removed: true };
      } else {
        // Add
        const { error, data } = await supabase
          .from("user_favorites")
          .insert([{ user_id: userId, thesis_id: thesisId }])
          .select()
          .single();
        if (error) throw error;
        return { added: true, ...data };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_favorites"] });
    },
  });
}

// Saved Searches Hooks
export function useSavedSearches(userId: string | undefined) {
  return useQuery({
    queryKey: ["saved_searches", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("saved_searches")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
}

export function useSaveSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      name,
      query,
      filters,
    }: { userId: string; name: string; query: string; filters?: any }) => {
      const { data, error } = await supabase
        .from("saved_searches")
        .insert([{ user_id: userId, name, query, filters }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved_searches"] });
    },
  });
}

export function useDeleteSavedSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("saved_searches")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved_searches"] });
    },
  });
}
