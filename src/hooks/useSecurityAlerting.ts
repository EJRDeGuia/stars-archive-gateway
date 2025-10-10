import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface AlertThreshold {
  id: string;
  threshold_type: string;
  threshold_value: number;
  window_minutes: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  notification_enabled: boolean;
  last_triggered?: string;
}

interface RealTimeAlert {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string;
  created_at: string;
  user_id?: string;
  metadata?: any;
}

export function useSecurityAlerting() {
  const { user } = useAuth();
  const [thresholds, setThresholds] = useState<AlertThreshold[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<RealTimeAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Monitor failed login attempts
  useEffect(() => {
    if (!isMonitoring || !user) return;

    const checkFailedLogins = async () => {
      try {
        const { data, error } = await supabase
          .from('failed_login_attempts')
          .select('*')
          .gte('attempted_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())
          .order('attempted_at', { ascending: false });

        if (error) throw error;

        // Group by IP to detect brute force
        const ipCounts: Record<string, number> = {};
        data?.forEach((attempt: any) => {
          const ip = attempt.ip_address;
          ipCounts[ip] = (ipCounts[ip] || 0) + 1;
        });

        // Alert on threshold breach (3+ attempts in 5 minutes)
        Object.entries(ipCounts).forEach(([ip, count]) => {
          if (count >= 3) {
            toast.error(`Security Alert: ${count} failed login attempts from ${ip}`, {
              duration: 10000,
              important: true
            });
          }
        });
      } catch (error) {
        console.error('Failed login monitoring error:', error);
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkFailedLogins, 30000);
    checkFailedLogins(); // Initial check

    return () => clearInterval(interval);
  }, [isMonitoring, user]);

  // Real-time security alerts subscription
  useEffect(() => {
    if (!isMonitoring || !user) return;

    const channel = supabase
      .channel('security-alerts-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_alerts',
          filter: `severity=in.(high,critical)`
        },
        (payload) => {
          const alert = payload.new as RealTimeAlert;
          
          // Show critical alerts immediately
          if (alert.severity === 'critical') {
            toast.error(`🚨 Critical Security Alert: ${alert.title}`, {
              description: alert.description,
              duration: Infinity, // Don't auto-dismiss
              important: true
            });
          } else if (alert.severity === 'high') {
            toast.warning(`⚠️ High Priority Alert: ${alert.title}`, {
              description: alert.description,
              duration: 10000
            });
          }

          setRecentAlerts(prev => [alert, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isMonitoring, user]);

  // Monitor session anomalies
  useEffect(() => {
    if (!isMonitoring || !user) return;

    const checkSessionAnomalies = async () => {
      try {
        const { data, error } = await supabase
          .from('session_tracking')
          .select('*')
          .eq('is_active', true)
          .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

        if (error) throw error;

        // Check for multiple active sessions from same user but different IPs
        const userSessions: Record<string, Set<string>> = {};
        data?.forEach((session: any) => {
          if (!userSessions[session.user_id]) {
            userSessions[session.user_id] = new Set();
          }
          userSessions[session.user_id].add(session.ip_address);
        });

        // Alert if user has sessions from 3+ different IPs
        Object.entries(userSessions).forEach(([userId, ips]) => {
          if (ips.size >= 3) {
            toast.warning(`Session Anomaly: User has ${ips.size} active sessions from different locations`, {
              duration: 10000
            });
          }
        });
      } catch (error) {
        console.error('Session anomaly monitoring error:', error);
      }
    };

    // Check every 2 minutes
    const interval = setInterval(checkSessionAnomalies, 120000);
    checkSessionAnomalies(); // Initial check

    return () => clearInterval(interval);
  }, [isMonitoring, user]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    toast.info(isMonitoring ? 'Real-time alerting paused' : 'Real-time alerting resumed');
  };

  return {
    isMonitoring,
    toggleMonitoring,
    recentAlerts,
    thresholds
  };
}
