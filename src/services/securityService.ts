import { supabase } from "@/integrations/supabase/client";

export interface SecurityValidationResult {
  valid: boolean;
  risk_score: number;
  session_id?: string;
  recommendations?: string[];
  reason?: string;
}

export interface IPReputationResult {
  reputation_score: number;
  blocked: boolean;
  threat_types: string[];
  recommendation: 'allow' | 'challenge' | 'block' | 'monitor';
}

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
  reset_time: string;
}

export interface SecurityDashboardData {
  alerts: any[];
  failedLogins: any[];
  activeSessions: number;
  timestamp: string;
}

class SecurityService {
  private static instance: SecurityService;
  
  private constructor() {}

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  /**
   * Validate current session security
   */
  async validateSession(sessionToken: string): Promise<SecurityValidationResult> {
    try {
      const userAgent = navigator.userAgent;
      
      const { data, error } = await supabase.functions.invoke('security-monitor', {
        body: {
          action: 'validate_session',
          data: {
            sessionToken,
            userAgent
          }
        }
      });

      if (error) throw error;
      
      return data.validation;
    } catch (error) {
      console.error('Session validation error:', error);
      return {
        valid: false,
        risk_score: 100,
        reason: 'validation_error'
      };
    }
  }

  /**
   * Check IP reputation
   */
  async checkIPReputation(): Promise<IPReputationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('security-monitor', {
        body: {
          action: 'check_ip_reputation',
          data: {}
        }
      });

      if (error) throw error;
      
      return data.reputation;
    } catch (error) {
      console.error('IP reputation check error:', error);
      return {
        reputation_score: 50,
        blocked: false,
        threat_types: [],
        recommendation: 'monitor'
      };
    }
  }

  /**
   * Check rate limits for an action
   */
  async checkRateLimit(
    action: string, 
    limit: number = 100, 
    windowMinutes: number = 60
  ): Promise<RateLimitResult> {
    try {
      const { data, error } = await supabase.functions.invoke('security-monitor', {
        body: {
          action: 'rate_limit_check',
          data: {
            action,
            limit,
            windowMinutes
          }
        }
      });

      if (error) throw error;
      
      return data.rateLimit;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return {
        allowed: true,
        count: 0,
        limit,
        reset_time: new Date(Date.now() + windowMinutes * 60000).toISOString()
      };
    }
  }

  /**
   * Log a security event
   */
  async logSecurityEvent(
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    title: string,
    description: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      await supabase.functions.invoke('security-monitor', {
        body: {
          action: 'log_security_event',
          data: {
            eventType,
            severity,
            title,
            description,
            metadata
          }
        }
      });
    } catch (error) {
      console.error('Security event logging error:', error);
    }
  }

  /**
   * Detect user anomalies
   */
  async detectAnomalies(): Promise<void> {
    try {
      await supabase.functions.invoke('security-monitor', {
        body: {
          action: 'detect_anomalies',
          data: {}
        }
      });
    } catch (error) {
      console.error('Anomaly detection error:', error);
    }
  }

  /**
   * Get security dashboard data
   */
  async getSecurityDashboard(): Promise<SecurityDashboardData> {
    try {
      const { data, error } = await supabase.functions.invoke('security-monitor', {
        body: {
          action: 'get_security_dashboard',
          data: {}
        }
      });

      if (error) throw error;
      
      return data.data;
    } catch (error) {
      console.error('Security dashboard error:', error);
      return {
        alerts: [],
        failedLogins: [],
        activeSessions: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Monitor failed login attempts
   */
  async logFailedLogin(email: string, reason: string): Promise<void> {
    try {
      await this.logSecurityEvent(
        'failed_login',
        'medium',
        'Failed Login Attempt',
        `Failed login attempt for email: ${email}`,
        { email, reason, timestamp: new Date().toISOString() }
      );
    } catch (error) {
      console.error('Failed login logging error:', error);
    }
  }

  /**
   * Monitor suspicious downloads
   */
  async logSuspiciousDownload(thesisId: string, reason: string): Promise<void> {
    try {
      await this.logSecurityEvent(
        'suspicious_download',
        'medium',
        'Suspicious Download Activity',
        `Suspicious download detected for thesis: ${thesisId}`,
        { thesisId, reason, timestamp: new Date().toISOString() }
      );
    } catch (error) {
      console.error('Suspicious download logging error:', error);
    }
  }

  /**
   * Create user session with security monitoring
   */
  async createSecureSession(userId: string, sessionData: any): Promise<string | null> {
    try {
      // Check if user has too many active sessions
      const rateLimit = await this.checkRateLimit('session_creation', 5, 60);
      if (!rateLimit.allowed) {
        await this.logSecurityEvent(
          'session_limit_exceeded',
          'high',
          'Session Creation Limit Exceeded',
          'User attempted to create too many sessions',
          { userId, rateLimitData: rateLimit }
        );
        throw new Error('Too many active sessions');
      }

      // Create session using database function
      const { data, error } = await supabase.rpc('create_user_session', {
        _user_id: userId,
        _session_token: crypto.randomUUID(),
        _device_fingerprint: sessionData.deviceFingerprint,
        _ip_address: sessionData.ipAddress,
        _user_agent: sessionData.userAgent,
        _location_data: sessionData.locationData,
        _session_type: sessionData.sessionType || 'regular',
        _expires_in_hours: sessionData.expiresInHours || 2
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Secure session creation error:', error);
      return null;
    }
  }

  /**
   * Monitor data access patterns
   */
  async monitorDataAccess(
    resourceType: string,
    resourceId: string,
    action: string
  ): Promise<void> {
    try {
      // Check for unusual access patterns
      const rateLimit = await this.checkRateLimit(`${action}_${resourceType}`, 50, 60);
      
      if (!rateLimit.allowed) {
        await this.logSecurityEvent(
          'data_access_anomaly',
          'high',
          'Unusual Data Access Pattern',
          `High frequency ${action} operations on ${resourceType}`,
          { resourceType, resourceId, action, rateLimitData: rateLimit }
        );
      }

      // Run anomaly detection
      await this.detectAnomalies();
    } catch (error) {
      console.error('Data access monitoring error:', error);
    }
  }

  /**
   * Validate file access permissions
   */
  async validateFileAccess(thesisId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('can_access_thesis_file', {
        _thesis_id: thesisId
      });

      if (error) throw error;

      if (!data) {
        await this.logSecurityEvent(
          'unauthorized_file_access',
          'high',
          'Unauthorized File Access Attempt',
          `User attempted to access restricted thesis file: ${thesisId}`,
          { thesisId }
        );
      }

      return data || false;
    } catch (error) {
      console.error('File access validation error:', error);
      return false;
    }
  }
}

export const securityService = SecurityService.getInstance();