import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { securityService } from '@/services/securityService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSecurityMonitoring = () => {
  const { user } = useAuth();

  // Monitor session security
  const validateCurrentSession = useCallback(async () => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const validation = await securityService.validateSession(session.access_token);
      
      if (!validation.valid || validation.risk_score > 80) {
        toast.error('Session security issue detected. Please re-authenticate.');
        
        // Force logout on high-risk sessions
        if (validation.risk_score > 90) {
          window.location.href = '/login';
        }
      } else if (validation.risk_score > 50) {
        toast.warning('Unusual session activity detected. Please verify your identity.');
      }
    } catch (error) {
      console.error('Session validation error:', error);
    }
  }, [user]);

  // Check IP reputation
  const checkIPSecurity = useCallback(async () => {
    try {
      const reputation = await securityService.checkIPReputation();
      
      if (reputation.blocked || reputation.reputation_score < 20) {
        toast.error('Access from this location has been restricted for security reasons.');
      } else if (reputation.reputation_score < 40) {
        toast.warning('Security notice: Accessing from a location with security concerns.');
      }
    } catch (error) {
      console.error('IP reputation check error:', error);
    }
  }, []);

  // Monitor for anomalies
  const performAnomalyDetection = useCallback(async () => {
    if (!user) return;

    try {
      await securityService.detectAnomalies();
    } catch (error) {
      console.error('Anomaly detection error:', error);
    }
  }, [user]);

  // Log security events
  const logSecurityEvent = useCallback(async (
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    title: string,
    description: string,
    metadata: Record<string, any> = {}
  ) => {
    try {
      await securityService.logSecurityEvent(eventType, severity, title, description, metadata);
    } catch (error) {
      console.error('Security event logging error:', error);
    }
  }, []);

  // Monitor data access
  const monitorDataAccess = useCallback(async (
    resourceType: string,
    resourceId: string,
    action: string
  ) => {
    try {
      await securityService.monitorDataAccess(resourceType, resourceId, action);
    } catch (error) {
      console.error('Data access monitoring error:', error);
    }
  }, []);

  // Validate file access
  const validateFileAccess = useCallback(async (thesisId: string): Promise<boolean> => {
    try {
      return await securityService.validateFileAccess(thesisId);
    } catch (error) {
      console.error('File access validation error:', error);
      return false;
    }
  }, []);

  // Check rate limits
  const checkRateLimit = useCallback(async (
    action: string,
    limit: number = 100,
    windowMinutes: number = 60
  ) => {
    try {
      const rateLimit = await securityService.checkRateLimit(action, limit, windowMinutes);
      
      if (!rateLimit.allowed) {
        toast.error(`Rate limit exceeded for ${action}. Please try again later.`);
        return false;
      }
      
      // Warn when approaching limit
      if (rateLimit.count > rateLimit.limit * 0.8) {
        toast.warning(`Approaching rate limit for ${action}. ${rateLimit.count}/${rateLimit.limit} requests used.`);
      }
      
      return true;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return true; // Allow on error to prevent blocking legitimate users
    }
  }, []);

  // Initialize security monitoring
  useEffect(() => {
    if (user) {
      // Initial security checks
      validateCurrentSession();
      checkIPSecurity();
      performAnomalyDetection();

      // Set up periodic monitoring
      const securityInterval = setInterval(() => {
        validateCurrentSession();
        performAnomalyDetection();
      }, 5 * 60 * 1000); // Every 5 minutes

      return () => {
        clearInterval(securityInterval);
      };
    }
  }, [user, validateCurrentSession, checkIPSecurity, performAnomalyDetection]);

  // Monitor page visibility changes (potential session hijacking)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        // Re-validate session when page becomes visible
        validateCurrentSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, validateCurrentSession]);

  // Monitor for suspicious user behavior
  useEffect(() => {
    const handleSuspiciousActivity = () => {
      logSecurityEvent(
        'suspicious_user_behavior',
        'medium',
        'Suspicious User Behavior Detected',
        'Rapid or unusual user interactions detected',
        {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        }
      );
    };

    // Monitor rapid clicks (potential bot behavior)
    let clickCount = 0;
    const resetClickCount = () => { clickCount = 0; };
    const clickTimer = setInterval(resetClickCount, 1000);

    const handleRapidClicks = () => {
      clickCount++;
      if (clickCount > 10) { // More than 10 clicks per second
        handleSuspiciousActivity();
        clickCount = 0; // Reset to prevent spam
      }
    };

    document.addEventListener('click', handleRapidClicks);

    return () => {
      clearInterval(clickTimer);
      document.removeEventListener('click', handleRapidClicks);
    };
  }, [logSecurityEvent]);

  return {
    validateCurrentSession,
    checkIPSecurity,
    performAnomalyDetection,
    logSecurityEvent,
    monitorDataAccess,
    validateFileAccess,
    checkRateLimit
  };
};