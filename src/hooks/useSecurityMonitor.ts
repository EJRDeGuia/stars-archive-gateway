import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: string;
  alert_type: string;
  created_at: string;
  resolved: boolean;
  user_id?: string;
  ip_address?: string;
  metadata?: any;
}

interface ActiveSession {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  location_data: any;
  created_at: string;
  last_activity: string;
  session_type: string;
  is_active: boolean;
}

interface SecurityStats {
  totalAlerts: number;
  unresolvedAlerts: number;
  activeSessions: number;
  recentScans: number;
}

export const useSecurityMonitor = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalAlerts: 0,
    unresolvedAlerts: 0,
    activeSessions: 0,
    recentScans: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSecurityAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Type cast and clean data
      const cleanedData = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        severity: item.severity,
        alert_type: item.alert_type,
        created_at: item.created_at,
        resolved: item.resolved,
        user_id: item.user_id,
        ip_address: item.ip_address ? String(item.ip_address) : undefined,
        metadata: item.metadata
      }));
      
      setAlerts(cleanedData);
    } catch (err: any) {
      console.error('Error fetching security alerts:', err);
      setError(err.message);
    }
  };

  const fetchActiveSessions = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('session-manager', {
        body: { action: 'get_active_sessions' }
      });

      if (error) throw error;
      setSessions(data.sessions || []);
    } catch (err: any) {
      console.error('Error fetching active sessions:', err);
      setError(err.message);
    }
  };

  const fetchStats = async () => {
    try {
      // Get alert stats
      const { data: alertData } = await supabase
        .from('security_alerts')
        .select('id, resolved')
        .gt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Get session count
      const { data: sessionData } = await supabase
        .from('session_tracking')
        .select('id')
        .eq('is_active', true);

      // Get recent scans
      const { data: scanData } = await supabase
        .from('file_scan_results')
        .select('id')
        .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      setStats({
        totalAlerts: alertData?.length || 0,
        unresolvedAlerts: alertData?.filter(a => !a.resolved).length || 0,
        activeSessions: sessionData?.length || 0,
        recentScans: scanData?.length || 0
      });
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('security_alerts')
        .update({ 
          resolved: true, 
          resolved_by: user?.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;
      
      // Refresh alerts
      await fetchSecurityAlerts();
      await fetchStats();
    } catch (err: any) {
      console.error('Error resolving alert:', err);
      setError(err.message);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      const { error } = await supabase.functions.invoke('session-manager', {
        body: { 
          action: 'terminate_session', 
          sessionData: { sessionId } 
        }
      });

      if (error) throw error;
      
      // Refresh sessions
      await fetchActiveSessions();
      await fetchStats();
    } catch (err: any) {
      console.error('Error terminating session:', err);
      setError(err.message);
    }
  };

  const runAnomalyDetection = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('anomaly-detector', {
        body: { userId }
      });

      if (error) throw error;
      
      // Refresh data after detection
      await Promise.all([fetchSecurityAlerts(), fetchStats()]);
      
      return data;
    } catch (err: any) {
      console.error('Error running anomaly detection:', err);
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSecurityAlerts(),
          fetchActiveSessions(),
          fetchStats()
        ]);
      } catch (err) {
        console.error('Error fetching security data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscriptions
    const alertsSubscription = supabase
      .channel('security-alerts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'security_alerts'
      }, () => {
        fetchSecurityAlerts();
        fetchStats();
      })
      .subscribe();

    const sessionsSubscription = supabase
      .channel('session-tracking')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'session_tracking'
      }, () => {
        fetchActiveSessions();
        fetchStats();
      })
      .subscribe();

    return () => {
      alertsSubscription.unsubscribe();
      sessionsSubscription.unsubscribe();
    };
  }, []);

  return {
    alerts,
    sessions,
    stats,
    loading,
    error,
    actions: {
      resolveAlert,
      terminateSession,
      runAnomalyDetection,
      refresh: () => Promise.all([fetchSecurityAlerts(), fetchActiveSessions(), fetchStats()])
    }
  };
};