import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
  expires_at?: string;
  metadata?: any;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch notifications for current user with role-based filtering
  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase.functions.invoke('notification-manager', {
        body: { action: 'get_notifications' }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.message);
      
      return data.notifications as Notification[];
    },
    enabled: !!user
  });

  // Create notification for specific users
  const createNotification = useMutation({
    mutationFn: async (params: {
      title: string;
      message: string;
      type?: 'info' | 'success' | 'warning' | 'error';
      targetUsers?: string[];
      targetRoles?: string[];
      expiresAt?: string;
      metadata?: any;
    }) => {
      const { data, error } = await supabase.functions.invoke('notification-manager', {
        body: { 
          action: 'create_notification',
          data: params
        }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.message);
      
      return data;
    },
    onSuccess: () => {
      toast.success('Notification created successfully');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to create notification: ${error.message}`);
    }
  });

  // Broadcast notification (admin/archivist only)
  const broadcastNotification = useMutation({
    mutationFn: async (params: {
      title: string;
      message: string;
      type?: 'info' | 'success' | 'warning' | 'error';
      expiresAt?: string;
      metadata?: any;
    }) => {
      const { data, error } = await supabase.functions.invoke('notification-manager', {
        body: { 
          action: 'broadcast_notification',
          data: params
        }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.message);
      
      return data;
    },
    onSuccess: () => {
      toast.success('Broadcast notification sent successfully');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to broadcast notification: ${error.message}`);
    }
  });

  // Mark as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Mark all as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Delete notification
  const deleteNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Get unread count
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    createNotification: createNotification.mutate,
    broadcastNotification: broadcastNotification.mutate,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isCreating: createNotification.isPending,
    isBroadcasting: broadcastNotification.isPending,
  };
};