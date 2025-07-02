import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { supabase } from "@/integrations/supabase/client";

// Generic hook for API queries with enhanced error handling
export function useApiQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: any
) {
  return useQuery({
    queryKey,
    queryFn,
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    ...options,
  });
}

// Generic hook for API mutations with enhanced error handling
export function useApiMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options?: any
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries after successful mutation
      if (options?.invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: options.invalidateQueries });
      }
      
      // Call custom onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      console.error('Mutation error:', error);
      
      // Call custom onError if provided
      if (options?.onError) {
        options.onError(error, variables);
      }
    },
    ...options,
  });
}

// Enhanced theses hook with better filtering and performance
export function useTheses(params?: { 
  page?: number; 
  limit?: number; 
  search?: string; 
  includeAll?: boolean;
  college_id?: string;
  status?: 'pending_review' | 'approved' | 'needs_revision' | 'rejected';
}) {
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

      // Apply status filter with proper typing
      if (!params?.includeAll) {
        const statusValue = params?.status || 'approved';
        query = query.eq('status', statusValue);
      } else if (params?.status) {
        // If includeAll is true but a specific status is requested
        query = query.eq('status', params.status);
      }

      // Apply college filter
      if (params?.college_id) {
        query = query.eq('college_id', params.college_id);
      }

      // Apply search filter
      if (params?.search && params.search.trim()) {
        const searchTerm = params.search.trim();
        query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,abstract.ilike.%${searchTerm}%`);
      }

      // Apply pagination
      if (params?.page && params?.limit) {
        const from = (params.page - 1) * params.limit;
        const to = from + params.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[useTheses] Error fetching theses:', error);
        throw error;
      }
      
      console.log('[useTheses] Successfully fetched theses:', data?.length || 0);
      return { data: data || [], count };
    },
    staleTime: 1 * 60 * 1000, // 1 minute for fresh data
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    retry: (failureCount, error: any) => {
      if (error?.code === 'PGRST301') return false;
      return failureCount < 2;
    },
    // Refetch when focus returns to ensure fresh data
    refetchOnWindowFocus: true,
  });
}

export function useThesis(id: string) {
  return useApiQuery(
    ['thesis', id],
    () => apiService.getThesis(id),
    { 
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutes for individual thesis
    }
  );
}

export function useCreateThesis() {
  return useApiMutation(
    (thesis: FormData) => apiService.createThesis(thesis),
    { 
      invalidateQueries: ['theses'],
      onSuccess: () => {
        console.log('Thesis created successfully');
      }
    }
  );
}

export function useUpdateThesis() {
  return useApiMutation(
    ({ id, thesis }: { id: string; thesis: any }) => apiService.updateThesis(id, thesis),
    { 
      invalidateQueries: ['theses'],
      onSuccess: (data, variables) => {
        console.log('Thesis updated successfully:', variables.id);
      }
    }
  );
}

export function useDeleteThesis() {
  return useApiMutation(
    (id: string) => apiService.deleteThesis(id),
    { 
      invalidateQueries: ['theses'],
      onSuccess: (data, id) => {
        console.log('Thesis deleted successfully:', id);
      }
    }
  );
}

export function useSearch() {
  return useApiMutation(
    ({ query, filters }: { query: string; filters?: any }) => apiService.search(query, filters)
  );
}

// Enhanced colleges hook with better caching
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
    staleTime: 15 * 60 * 1000, // 15 minutes - colleges don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime)
  });
}

// Enhanced user favorites with better error handling
export function useUserFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: ["user_favorites", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('[useUserFavorites] Fetching favorites for user:', userId);
      
      const { data, error } = await supabase
        .from("user_favorites")
        .select(`
          *,
          theses (
            id,
            title,
            author,
            abstract
          )
        `)
        .eq("user_id", userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[useUserFavorites] Error:', error);
        throw error;
      }
      
      console.log('[useUserFavorites] Fetched data:', data?.length || 0, 'favorites');
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: (failureCount, error: any) => {
      if (error?.code === 'PGRST301') return false;
      return failureCount < 2;
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      userId,
      thesisId,
      favoriteId,
    }: { userId: string; thesisId: string; favoriteId?: string | null }) => {
      console.log('[useToggleFavorite] Toggle favorite called with:', { userId, thesisId, favoriteId });
      
      try {
        if (favoriteId) {
          // Remove favorite
          console.log('[useToggleFavorite] Removing favorite:', favoriteId);
          const { error } = await supabase
            .from("user_favorites")
            .delete()
            .eq("id", favoriteId);
          
          if (error) {
            console.error('[useToggleFavorite] Error removing favorite:', error);
            throw new Error(`Failed to remove from library: ${error.message}`);
          }
          
          console.log('[useToggleFavorite] Successfully removed favorite');
          return { removed: true, favoriteId };
        } else {
          // Add favorite
          console.log('[useToggleFavorite] Adding favorite for thesis:', thesisId);
          const { error, data } = await supabase
            .from("user_favorites")
            .insert([{ user_id: userId, thesis_id: thesisId }])
            .select()
            .single();
          
          if (error) {
            console.error('[useToggleFavorite] Error adding favorite:', error);
            
            // Check for duplicate error specifically
            if (error.code === '23505') {
              throw new Error('This thesis is already in your library');
            }
            
            throw new Error(`Failed to add to library: ${error.message}`);
          }
          
          if (!data) {
            throw new Error('Failed to add to library: No data returned');
          }
          
          console.log('[useToggleFavorite] Successfully added favorite:', data);
          return { ...data, added: true };
        }
      } catch (error) {
        console.error('[useToggleFavorite] Mutation function error:', error);
        throw error;
      }
    },
    onSuccess: (result, variables) => {
      console.log('[useToggleFavorite] Success callback with result:', result);
      
      // Invalidate all favorite-related queries
      queryClient.invalidateQueries({ queryKey: ["user_favorites"] });
      queryClient.invalidateQueries({ queryKey: ["user_favorites_with_theses"] });
      
      // Update the user favorites cache optimistically
      queryClient.setQueryData(
        ["user_favorites", variables.userId],
        (oldData: any[]) => {
          if (!oldData) return [];
          
          if ('removed' in result && result.removed) {
            return oldData.filter(fav => fav.id !== variables.favoriteId);
          } else if ('added' in result && result.added) {
            return [...oldData, result];
          }
          
          return oldData;
        }
      );
    },
    onError: (error, variables) => {
      console.error('[useToggleFavorite] Error callback:', error, 'Variables:', variables);
      
      // Invalidate queries on error to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["user_favorites", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["user_favorites_with_theses", variables.userId] });
    },
    retry: 1, // Only retry once for favorites
  });
}

// Enhanced saved searches with better performance
export function useSavedSearches(userId: string | undefined) {
  return useQuery({
    queryKey: ["saved_searches", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("saved_searches")
        .select("*")
        .eq("user_id", userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
        .insert([{ user_id: userId, name: name.trim(), query: query.trim(), filters }])
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
