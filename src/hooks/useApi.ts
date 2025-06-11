
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';

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
export function useTheses(params?: { page?: number; limit?: number; search?: string }) {
  return useApiQuery(
    ['theses', JSON.stringify(params)],
    () => apiService.getTheses(params)
  );
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
  return useApiQuery(
    ['colleges'],
    () => apiService.getColleges()
  );
}
