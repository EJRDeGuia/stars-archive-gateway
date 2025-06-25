
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useResourcesContent() {
  return useQuery({
    queryKey: ['resources-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources_content')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
}
