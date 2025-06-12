
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseApi } from '@/services/supabaseApi';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

// User hooks
export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => supabaseApi.getUserProfile(userId!),
    enabled: !!userId,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: any }) => 
      supabaseApi.updateUserProfile(userId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', data.id] });
    },
  });
}

// College hooks
export function useColleges() {
  return useQuery({
    queryKey: ['colleges'],
    queryFn: () => supabaseApi.getColleges(),
  });
}

export function useCollege(id: string) {
  return useQuery({
    queryKey: ['college', id],
    queryFn: () => supabaseApi.getCollegeById(id),
    enabled: !!id,
  });
}

export function useCreateCollege() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (college: any) => supabaseApi.createCollege(college),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    },
  });
}

export function useUpdateCollege() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      supabaseApi.updateCollege(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    },
  });
}

export function useDeleteCollege() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => supabaseApi.deleteCollege(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    },
  });
}

// Program hooks
export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: () => supabaseApi.getPrograms(),
  });
}

export function useProgramsByCollege(collegeId: string) {
  return useQuery({
    queryKey: ['programs', 'college', collegeId],
    queryFn: () => supabaseApi.getProgramsByCollege(collegeId),
    enabled: !!collegeId,
  });
}

// Thesis hooks
export function useTheses(params?: any) {
  return useQuery({
    queryKey: ['theses', params],
    queryFn: () => supabaseApi.getTheses(params),
  });
}

export function useThesis(id: string) {
  return useQuery({
    queryKey: ['thesis', id],
    queryFn: () => supabaseApi.getThesis(id),
    enabled: !!id,
  });
}

export function useCreateThesis() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (thesis: any) => supabaseApi.createThesis(thesis),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theses'] });
    },
  });
}

export function useUpdateThesis() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      supabaseApi.updateThesis(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theses'] });
    },
  });
}

export function useDeleteThesis() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => supabaseApi.deleteThesis(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theses'] });
    },
  });
}

// Search hooks
export function useSearchTheses() {
  return useMutation({
    mutationFn: ({ query, filters }: { query: string; filters?: any }) => 
      supabaseApi.searchTheses(query, filters),
  });
}

// User management hooks (admin only)
export function useAllUsers() {
  return useQuery({
    queryKey: ['users', 'all'],
    queryFn: () => supabaseApi.getAllUsers(),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Database['public']['Enums']['user_role'] }) => 
      supabaseApi.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] });
    },
  });
}

// Analytics hooks
export function useRecordThesisView() {
  return useMutation({
    mutationFn: ({ thesisId, userId }: { thesisId: string; userId?: string }) => 
      supabaseApi.recordThesisView(thesisId, userId),
  });
}

export function useRecordThesisDownload() {
  return useMutation({
    mutationFn: ({ thesisId, userId }: { thesisId: string; userId?: string }) => 
      supabaseApi.recordThesisDownload(thesisId, userId),
  });
}
