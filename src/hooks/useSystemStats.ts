
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useSystemStats() {
  return useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_statistics')
        .select('*')
        .order('stat_key');
      
      if (error) throw error;
      
      // Convert to object format for easier access
      const statsObject: Record<string, { value: number; label: string; updated_at: string }> = {};
      data?.forEach(stat => {
        statsObject[stat.stat_key] = {
          value: stat.stat_value,
          label: stat.stat_label,
          updated_at: stat.updated_at
        };
      });
      
      return statsObject;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
