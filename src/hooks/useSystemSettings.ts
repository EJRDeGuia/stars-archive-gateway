import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_label: string;
  setting_description: string | null;
  setting_type: 'string' | 'number' | 'boolean' | 'json';
  created_at: string;
  updated_at: string;
}

export const useSystemSettings = () => {
  const queryClient = useQueryClient();

  // Fetch system settings
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key');
      
      if (error) throw error;
      return data as SystemSetting[];
    }
  });

  // Update system setting
  const updateSetting = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: any }) => {
      const { data, error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: value,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Setting updated successfully');
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update setting: ${error.message}`);
    }
  });

  // Update multiple settings at once
  const updateMultipleSettings = useMutation({
    mutationFn: async (updates: { id: string; value: any }[]) => {
      const promises = updates.map(({ id, value }) =>
        supabase
          .from('system_settings')
          .update({ 
            setting_value: value,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error);
      
      if (errors.length > 0) {
        throw new Error(`Failed to update ${errors.length} settings`);
      }
      
      return results;
    },
    onSuccess: () => {
      toast.success('All settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update settings: ${error.message}`);
    }
  });

  // Helper function to get setting by key
  const getSettingByKey = (key: string) => {
    return settings.find(setting => setting.setting_key === key);
  };

  // Helper function to get setting value by key
  const getSettingValue = (key: string, defaultValue: any = null) => {
    const setting = getSettingByKey(key);
    if (!setting) return defaultValue;
    
    // Parse JSON values
    if (setting.setting_type === 'json') {
      return typeof setting.setting_value === 'string' 
        ? JSON.parse(setting.setting_value) 
        : setting.setting_value;
    }
    
    // Parse string values from JSON storage
    if (setting.setting_type === 'string' && typeof setting.setting_value === 'string') {
      return setting.setting_value.replace(/^"|"$/g, ''); // Remove quotes
    }
    
    return setting.setting_value;
  };

  // Convert settings to a more usable format
  const settingsMap = settings.reduce((acc, setting) => {
    acc[setting.setting_key] = {
      ...setting,
      parsedValue: getSettingValue(setting.setting_key)
    };
    return acc;
  }, {} as Record<string, SystemSetting & { parsedValue: any }>);

  return {
    settings,
    settingsMap,
    isLoading,
    updateSetting: updateSetting.mutate,
    updateMultipleSettings: updateMultipleSettings.mutate,
    isUpdating: updateSetting.isPending || updateMultipleSettings.isPending,
    getSettingByKey,
    getSettingValue,
  };
};