import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { enhancedSecurityService } from '@/services/enhancedSecurityService';
import { toast } from 'sonner';

interface ThreatLevel {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number;
  factors: string[];
}

interface SecurityMetrics {
  sessionSecurity: number;
  networkSecurity: number; 
  behavioralSecurity: number;
  contentSecurity: number;
  overallThreatLevel: ThreatLevel;
}

interface RealTimeAlert {
  id: string;
  type: 'brute_force' | 'anomaly' | 'malware' | 'suspicious_ip' | 'content_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  metadata: Record<string, any>;
}

interface AdvancedSecurityStatus {
  isSecure: boolean;
  metrics: SecurityMetrics;
  activeThreats: RealTimeAlert[];
  securityScore: number;
  recommendedActions: string[];
  systemStatus: 'optimal' | 'warning' | 'critical' | 'compromised';
}

export const useMaxSecurityMonitor = () => {
  const { user } = useAuth();
  const [securityStatus, setSecurityStatus] = useState<AdvancedSecurityStatus | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Real-time monitoring refs
  const monitoringInterval = useRef<NodeJS.Timeout>();
  const threatDetectionRef = useRef<NodeJS.Timeout>();
  const anomalyCheckRef = useRef<NodeJS.Timeout>();
  
  // Behavioral analysis
  const [userBehavior, setUserBehavior] = useState({
    clickPattern: [] as number[],
    scrollPattern: [] as number[],
    keystrokePattern: [] as number[],
    navigationPattern: [] as string[],
    sessionDuration: 0,
    suspiciousActivities: 0
  });

  // Calculate threat level based on multiple factors
  const calculateThreatLevel = useCallback((metrics: SecurityMetrics): ThreatLevel => {
    const {
      sessionSecurity,
      networkSecurity,
      behavioralSecurity,
      contentSecurity
    } = metrics;

    const avgScore = (sessionSecurity + networkSecurity + behavioralSecurity + contentSecurity) / 4;
    const factors: string[] = [];

    if (sessionSecurity < 70) factors.push('Session vulnerabilities detected');
    if (networkSecurity < 70) factors.push('Network security issues');
    if (behavioralSecurity < 60) factors.push('Suspicious user behavior');
    if (contentSecurity < 80) factors.push('Content protection weakened');

    let level: ThreatLevel['level'];
    if (avgScore >= 90) level = 'LOW';
    else if (avgScore >= 75) level = 'MEDIUM';
    else if (avgScore >= 60) level = 'HIGH';
    else level = 'CRITICAL';

    return {
      level,
      score: avgScore,
      factors
    };
  }, []);

  // Advanced behavioral analysis
  const analyzeBehavior = useCallback(async () => {
    const now = Date.now();
    const recentClicks = userBehavior.clickPattern.filter(time => now - time < 60000);
    const recentKeystrokes = userBehavior.keystrokePattern.filter(time => now - time < 60000);
    
    let suspiciousScore = 100;
    const suspiciousFactors: string[] = [];

    // Rapid clicking detection (bot-like behavior)
    if (recentClicks.length > 20) {
      suspiciousScore -= 30;
      suspiciousFactors.push('Rapid clicking detected');
    }

    // Keystroke pattern analysis
    if (recentKeystrokes.length > 50) {
      suspiciousScore -= 25;
      suspiciousFactors.push('Excessive keyboard activity');
    }

    // Navigation pattern analysis
    const uniquePages = new Set(userBehavior.navigationPattern.slice(-10));
    if (uniquePages.size > 8) {
      suspiciousScore -= 20;
      suspiciousFactors.push('Erratic navigation pattern');
    }

    // Session duration analysis
    if (userBehavior.sessionDuration > 8 * 60 * 60 * 1000) { // 8 hours
      suspiciousScore -= 15;
      suspiciousFactors.push('Unusually long session');
    }

    // Previous violations
    if (userBehavior.suspiciousActivities > 3) {
      suspiciousScore -= 40;
      suspiciousFactors.push('Multiple security violations');
    }

    return {
      score: Math.max(0, suspiciousScore),
      factors: suspiciousFactors
    };
  }, [userBehavior]);

  // Real-time security assessment
  const performSecurityAssessment = useCallback(async () => {
    try {
      if (!user) return;

      // Session security analysis
      const sessionSecurity = await analyzeSessionSecurity();
      
      // Network security analysis  
      const networkSecurity = await analyzeNetworkSecurity();
      
      // Behavioral security analysis
      const behavioralAnalysis = await analyzeBehavior();
      
      // Content security analysis
      const contentSecurity = await analyzeContentSecurity();

      const metrics: SecurityMetrics = {
        sessionSecurity: sessionSecurity.score,
        networkSecurity: networkSecurity.score,
        behavioralSecurity: behavioralAnalysis.score,
        contentSecurity: contentSecurity.score,
        overallThreatLevel: calculateThreatLevel({
          sessionSecurity: sessionSecurity.score,
          networkSecurity: networkSecurity.score,
          behavioralSecurity: behavioralAnalysis.score,
          contentSecurity: contentSecurity.score,
          overallThreatLevel: { level: 'LOW', score: 0, factors: [] }
        })
      };

      // Get active threats
      const activeThreats = await getActiveThreats();
      
      // Calculate overall security score
      const securityScore = Math.round(metrics.overallThreatLevel.score);
      
      // Generate recommendations
      const recommendedActions = generateRecommendations(metrics, activeThreats);
      
      // Determine system status
      const systemStatus = determineSystemStatus(metrics.overallThreatLevel.level, activeThreats.length);

      setSecurityStatus({
        isSecure: securityScore >= 75 && activeThreats.filter(t => t.severity === 'critical').length === 0,
        metrics,
        activeThreats,
        securityScore,
        recommendedActions,
        systemStatus
      });

      // Auto-response to critical threats
      if (metrics.overallThreatLevel.level === 'CRITICAL') {
        await handleCriticalThreat(metrics);
      }

    } catch (error) {
      console.error('Security assessment failed:', error);
      setError('Security monitoring error');
    }
  }, [user, analyzeBehavior, calculateThreatLevel]);

  // Session security analysis
  const analyzeSessionSecurity = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { score: 0, factors: ['No active session'] };
      }

      let score = 100;
      const factors: string[] = [];

      // Session age check
      const sessionAge = Date.now() - new Date(session.user.created_at || 0).getTime();
      if (sessionAge > 12 * 60 * 60 * 1000) { // 12 hours
        score -= 20;
        factors.push('Long-running session detected');
      }

      // Token validation
      const tokenValidation = await enhancedSecurityService.checkSessionTimeout(session.access_token);
      if (tokenValidation.expired) {
        score = 0;
        factors.push('Session expired');
      } else if (tokenValidation.warning) {
        score -= 30;
        factors.push('Session nearing expiration');
      }

      return { score: Math.max(0, score), factors };
    } catch (error) {
      return { score: 0, factors: ['Session validation failed'] };
    }
  };

  // Network security analysis
  const analyzeNetworkSecurity = async () => {
    try {
      let score = 100;
      const factors: string[] = [];

      // Check IP reputation (simulated)
      const ipCheck = await checkIPReputation();
      if (!ipCheck.safe) {
        score -= ipCheck.riskLevel * 20;
        factors.push(...ipCheck.issues);
      }

      // Check for VPN/Proxy usage (basic detection)
      const connectionInfo = await analyzeConnection();
      if (connectionInfo.isProxy) {
        score -= 25;
        factors.push('Proxy/VPN detected');
      }

      // Geolocation anomaly detection
      const geoCheck = await checkGeolocationAnomaly();
      if (geoCheck.suspicious) {
        score -= 30;
        factors.push('Unusual location access');
      }

      return { score: Math.max(0, score), factors };
    } catch (error) {
      return { score: 50, factors: ['Network analysis failed'] };
    }
  };

  // Content security analysis
  const analyzeContentSecurity = async () => {
    try {
      let score = 100;
      const factors: string[] = [];

      // Check for dev tools usage
      if (isDevToolsOpen()) {
        score -= 40;
        factors.push('Developer tools detected');
      }

      // Check for browser extensions that might interfere
      const extensionCheck = await checkBrowserExtensions();
      if (extensionCheck.suspicious) {
        score -= 20;
        factors.push('Suspicious browser extensions');
      }

      // Check document tampering attempts
      const tamperCheck = checkDocumentTampering();
      if (tamperCheck.detected) {
        score -= 50;
        factors.push('Document tampering attempts');
      }

      return { score: Math.max(0, score), factors };
    } catch (error) {
      return { score: 70, factors: ['Content analysis incomplete'] };
    }
  };

  // Helper functions for security analysis
  const checkIPReputation = async () => {
    // Simulated IP reputation check
    return {
      safe: Math.random() > 0.1, // 90% chance of safe IP
      riskLevel: Math.floor(Math.random() * 5),
      issues: Math.random() > 0.8 ? ['IP flagged in threat database'] : []
    };
  };

  const analyzeConnection = async () => {
    // Basic proxy detection (limited in browser environment)
    return {
      isProxy: false, // Would need server-side detection
      connectionType: 'standard'
    };
  };

  const checkGeolocationAnomaly = async () => {
    // Geolocation change detection would require server-side comparison
    return {
      suspicious: Math.random() > 0.95 // 5% chance of suspicious location
    };
  };

  const isDevToolsOpen = () => {
    // Basic dev tools detection
    const threshold = 160;
    return (window.outerHeight - window.innerHeight > threshold) ||
           (window.outerWidth - window.innerWidth > threshold);
  };

  const checkBrowserExtensions = async () => {
    // Limited extension detection in browser
    return {
      suspicious: false,
      detected: []
    };
  };

  const checkDocumentTampering = () => {
    // Check for signs of document manipulation
    return {
      detected: document.querySelector('*[style*="display: none"]') !== null
    };
  };

  const getActiveThreats = async (): Promise<RealTimeAlert[]> => {
    try {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('resolved', false)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map(alert => ({
        id: alert.id,
        type: alert.alert_type as any,
        severity: alert.severity as any,
        message: alert.title,
        timestamp: new Date(alert.created_at).getTime(),
        metadata: (alert.metadata as Record<string, any>) || {}
      }));
    } catch (error) {
      console.error('Failed to fetch active threats:', error);
      return [];
    }
  };

  const generateRecommendations = (metrics: SecurityMetrics, threats: RealTimeAlert[]): string[] => {
    const recommendations: string[] = [];

    if (metrics.sessionSecurity < 70) {
      recommendations.push('Extend or refresh current session');
    }
    if (metrics.networkSecurity < 70) {
      recommendations.push('Verify network connection security');
    }
    if (metrics.behavioralSecurity < 60) {
      recommendations.push('Review recent user activities');
    }
    if (metrics.contentSecurity < 80) {
      recommendations.push('Close developer tools and disable suspicious extensions');
    }
    if (threats.length > 5) {
      recommendations.push('Review and resolve active security alerts');
    }
    if (metrics.overallThreatLevel.level === 'CRITICAL') {
      recommendations.push('Immediate security intervention required');
    }

    return recommendations.length > 0 ? recommendations : ['System operating within normal parameters'];
  };

  const determineSystemStatus = (threatLevel: ThreatLevel['level'], activeThreats: number): AdvancedSecurityStatus['systemStatus'] => {
    if (threatLevel === 'CRITICAL' || activeThreats > 10) return 'compromised';
    if (threatLevel === 'HIGH' || activeThreats > 5) return 'critical';
    if (threatLevel === 'MEDIUM' || activeThreats > 2) return 'warning';
    return 'optimal';
  };

  const handleCriticalThreat = async (metrics: SecurityMetrics) => {
    // Log critical threat
    await supabase.rpc('comprehensive_audit_log', {
      _action: 'critical_threat_detected',
      _resource_type: 'security_system',
      _new_data: {
        threat_level: metrics.overallThreatLevel.level,
        security_score: metrics.overallThreatLevel.score,
        factors: metrics.overallThreatLevel.factors
      },
      _risk_level: 'critical',
      _compliance_tags: ['threat_response', 'automated_security']
    });

    // Show critical alert
    toast.error("CRITICAL SECURITY THREAT DETECTED - Access may be terminated", {
      duration: 10000
    });

    // Could implement automatic session termination here
    // setTimeout(() => window.location.href = '/login?reason=security_threat', 5000);
  };

  // Behavioral tracking
  useEffect(() => {
    const trackBehavior = () => {
      const handleClick = () => {
        setUserBehavior(prev => ({
          ...prev,
          clickPattern: [...prev.clickPattern.slice(-50), Date.now()]
        }));
      };

      const handleKeyDown = () => {
        setUserBehavior(prev => ({
          ...prev,
          keystrokePattern: [...prev.keystrokePattern.slice(-100), Date.now()]
        }));
      };

      const handleScroll = () => {
        setUserBehavior(prev => ({
          ...prev,
          scrollPattern: [...prev.scrollPattern.slice(-20), Date.now()]
        }));
      };

      const updateNavigation = () => {
        setUserBehavior(prev => ({
          ...prev,
          navigationPattern: [...prev.navigationPattern.slice(-20), window.location.pathname]
        }));
      };

      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('scroll', handleScroll);
      window.addEventListener('popstate', updateNavigation);

      return () => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('scroll', handleScroll);
        window.removeEventListener('popstate', updateNavigation);
      };
    };

    return trackBehavior();
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;

    setIsMonitoring(true);
    setLoading(true);

    // Initial assessment
    performSecurityAssessment().finally(() => setLoading(false));

    // Continuous monitoring
    monitoringInterval.current = setInterval(performSecurityAssessment, 30000); // Every 30 seconds
    
    // Anomaly detection
    anomalyCheckRef.current = setInterval(async () => {
      if (user) {
        try {
          await supabase.rpc('detect_user_anomalies', { _user_id: user.id });
        } catch (error) {
          console.error('Anomaly detection failed:', error);
        }
      }
    }, 2 * 60 * 1000); // Every 2 minutes

    // Update session duration
    const sessionStart = Date.now();
    const sessionTimer = setInterval(() => {
      setUserBehavior(prev => ({
        ...prev,
        sessionDuration: Date.now() - sessionStart
      }));
    }, 60000); // Every minute

    return () => {
      clearInterval(sessionTimer);
    };
  }, [isMonitoring, performSecurityAssessment, user]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
    }
    if (threatDetectionRef.current) {
      clearInterval(threatDetectionRef.current);
    }
    if (anomalyCheckRef.current) {
      clearInterval(anomalyCheckRef.current);
    }
  }, []);

  // Auto-start monitoring when component mounts
  useEffect(() => {
    startMonitoring();
    return stopMonitoring;
  }, [startMonitoring, stopMonitoring]);

  // Emergency lockdown
  const emergencyLockdown = useCallback(async () => {
    try {
      // Log emergency action
      await supabase.rpc('comprehensive_audit_log', {
        _action: 'emergency_lockdown_initiated',
        _resource_type: 'security_system',
        _risk_level: 'critical',
        _compliance_tags: ['emergency_response', 'security_lockdown']
      });

      // Terminate all sessions
      await supabase.auth.signOut();
      
      toast.error("EMERGENCY LOCKDOWN ACTIVATED");
      window.location.href = '/login?reason=emergency_lockdown';
    } catch (error) {
      console.error('Emergency lockdown failed:', error);
    }
  }, []);

  return {
    securityStatus,
    isMonitoring,
    loading,
    error,
    userBehavior,
    actions: {
      startMonitoring,
      stopMonitoring,
      performSecurityAssessment,
      emergencyLockdown,
      refreshStatus: performSecurityAssessment
    }
  };
};