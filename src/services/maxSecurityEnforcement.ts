import { supabase } from "@/integrations/supabase/client";
import { enhancedSecurityService } from "./enhancedSecurityService";
import { toast } from "sonner";

interface SecurityPolicy {
  id: string;
  name: string;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoEnforce: boolean;
  config: Record<string, any>;
}

interface SecurityViolation {
  policyId: string;
  violationType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  timestamp: number;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface EnforcementAction {
  type: 'warn' | 'restrict' | 'terminate' | 'block' | 'report';
  immediate: boolean;
  duration?: number;
  message?: string;
}

class MaxSecurityEnforcement {
  private static instance: MaxSecurityEnforcement;
  private policies: Map<string, SecurityPolicy> = new Map();
  private violationCounts: Map<string, number> = new Map();
  private enforcementQueue: SecurityViolation[] = [];
  private isEnforcing = false;

  private constructor() {
    this.initializePolicies();
    this.startEnforcementEngine();
  }

  public static getInstance(): MaxSecurityEnforcement {
    if (!MaxSecurityEnforcement.instance) {
      MaxSecurityEnforcement.instance = new MaxSecurityEnforcement();
    }
    return MaxSecurityEnforcement.instance;
  }

  private initializePolicies(): void {
    const defaultPolicies: SecurityPolicy[] = [
      {
        id: 'screenshot_protection',
        name: 'Screenshot Protection',
        enabled: true,
        severity: 'high',
        autoEnforce: true,
        config: {
          maxAttempts: 3,
          blockDuration: 24 * 60 * 60 * 1000, // 24 hours
          immediateTermination: false
        }
      },
      {
        id: 'dev_tools_detection',
        name: 'Developer Tools Detection',
        enabled: true,
        severity: 'critical',
        autoEnforce: true,
        config: {
          maxAttempts: 1,
          immediateTermination: true,
          alertAdmins: true
        }
      },
      {
        id: 'content_extraction',
        name: 'Content Extraction Prevention',
        enabled: true,
        severity: 'high',
        autoEnforce: true,
        config: {
          blockTextSelection: true,
          blockCopyPaste: true,
          blockDragDrop: true,
          maxViolations: 5
        }
      },
      {
        id: 'session_hijacking',
        name: 'Session Hijacking Protection',
        enabled: true,
        severity: 'critical',
        autoEnforce: true,
        config: {
          ipChangeDetection: true,
          userAgentValidation: true,
          concurrentSessionLimit: 2,
          suspiciousActivityThreshold: 3
        }
      },
      {
        id: 'rapid_access_prevention',
        name: 'Rapid Access Prevention',
        enabled: true,
        severity: 'medium',
        autoEnforce: true,
        config: {
          maxRequestsPerMinute: 30,
          maxDownloadsPerHour: 5,
          cooldownPeriod: 15 * 60 * 1000 // 15 minutes
        }
      },
      {
        id: 'geolocation_enforcement',
        name: 'Geolocation Enforcement',
        enabled: true,
        severity: 'high',
        autoEnforce: false, // Manual review for geographic restrictions
        config: {
          allowedCountries: ['PH'], // Philippines only
          allowedRegions: ['CALABARZON'],
          vpnDetection: true,
          proxyDetection: true
        }
      },
      {
        id: 'malware_protection',
        name: 'Malware Protection',
        enabled: true,
        severity: 'critical',
        autoEnforce: true,
        config: {
          realTimeScanning: true,
          quarantineThreshold: 'low',
          automaticCleanup: true
        }
      },
      {
        id: 'data_exfiltration',
        name: 'Data Exfiltration Prevention',
        enabled: true,
        severity: 'critical',
        autoEnforce: true,
        config: {
          maxDataTransfer: 100 * 1024 * 1024, // 100MB per day
          suspiciousPatterns: ['bulk_download', 'rapid_succession', 'automated_access'],
          instantBlock: true
        }
      }
    ];

    defaultPolicies.forEach(policy => {
      this.policies.set(policy.id, policy);
    });
  }

  private startEnforcementEngine(): void {
    // Process enforcement queue every 5 seconds
    setInterval(() => {
      if (!this.isEnforcing && this.enforcementQueue.length > 0) {
        this.processEnforcementQueue();
      }
    }, 5000);

    // Cleanup old violations every hour
    setInterval(() => {
      this.cleanupOldViolations();
    }, 60 * 60 * 1000);
  }

  public async reportViolation(violation: SecurityViolation): Promise<EnforcementAction[]> {
    try {
      // Add to enforcement queue
      this.enforcementQueue.push(violation);

      // Update violation count
      const violationKey = `${violation.userId || 'anonymous'}_${violation.policyId}`;
      const currentCount = this.violationCounts.get(violationKey) || 0;
      this.violationCounts.set(violationKey, currentCount + 1);

      // Log violation
      await this.logSecurityViolation(violation);

      // Determine enforcement actions
      const actions = await this.determineEnforcementActions(violation);

      // Execute immediate actions
      const immediateActions = actions.filter(action => action.immediate);
      for (const action of immediateActions) {
        await this.executeEnforcementAction(action, violation);
      }

      return actions;
    } catch (error) {
      console.error('Failed to report security violation:', error);
      return [];
    }
  }

  private async determineEnforcementActions(violation: SecurityViolation): Promise<EnforcementAction[]> {
    const policy = this.policies.get(violation.policyId);
    if (!policy || !policy.enabled) {
      return [];
    }

    const violationKey = `${violation.userId || 'anonymous'}_${violation.policyId}`;
    const violationCount = this.violationCounts.get(violationKey) || 0;
    const actions: EnforcementAction[] = [];

    switch (violation.policyId) {
      case 'screenshot_protection':
        if (violationCount === 1) {
          actions.push({
            type: 'warn',
            immediate: true,
            message: 'Screenshot attempt detected. This action is monitored and blocked.'
          });
        } else if (violationCount >= policy.config.maxAttempts) {
          actions.push({
            type: policy.config.immediateTermination ? 'terminate' : 'restrict',
            immediate: true,
            duration: policy.config.blockDuration,
            message: 'Multiple screenshot attempts detected. Access restricted.'
          });
        }
        break;

      case 'dev_tools_detection':
        actions.push({
          type: 'terminate',
          immediate: true,
          message: 'Developer tools detected. Session terminated for security.'
        });
        if (policy.config.alertAdmins) {
          actions.push({
            type: 'report',
            immediate: true,
            message: 'Developer tools usage reported to administrators'
          });
        }
        break;

      case 'content_extraction':
        if (violationCount >= policy.config.maxViolations) {
          actions.push({
            type: 'terminate',
            immediate: true,
            message: 'Excessive content extraction attempts detected'
          });
        } else {
          actions.push({
            type: 'warn',
            immediate: true,
            message: 'Content extraction attempt blocked'
          });
        }
        break;

      case 'session_hijacking':
        actions.push({
          type: 'terminate',
          immediate: true,
          message: 'Suspicious session activity detected'
        });
        actions.push({
          type: 'block',
          immediate: true,
          duration: 24 * 60 * 60 * 1000, // 24 hours
          message: 'IP address blocked due to suspicious activity'
        });
        break;

      case 'rapid_access_prevention':
        actions.push({
          type: 'restrict',
          immediate: true,
          duration: policy.config.cooldownPeriod,
          message: 'Rate limit exceeded. Please wait before making more requests.'
        });
        break;

      case 'geolocation_enforcement':
        if (policy.autoEnforce) {
          actions.push({
            type: 'block',
            immediate: true,
            message: 'Access denied from unauthorized geographic location'
          });
        } else {
          actions.push({
            type: 'report',
            immediate: true,
            message: 'Geographic violation flagged for manual review'
          });
        }
        break;

      case 'malware_protection':
        actions.push({
          type: 'block',
          immediate: true,
          message: 'Malicious content detected. Access blocked for system protection.'
        });
        actions.push({
          type: 'report',
          immediate: true,
          message: 'Malware incident reported to security team'
        });
        break;

      case 'data_exfiltration':
        actions.push({
          type: 'terminate',
          immediate: true,
          message: 'Data exfiltration attempt detected and blocked'
        });
        actions.push({
          type: 'block',
          immediate: true,
          duration: 7 * 24 * 60 * 60 * 1000, // 7 days
          message: 'Account blocked due to data exfiltration attempt'
        });
        break;
    }

    return actions;
  }

  private async executeEnforcementAction(action: EnforcementAction, violation: SecurityViolation): Promise<void> {
    try {
      switch (action.type) {
        case 'warn':
          this.showWarningMessage(action.message || 'Security policy violation detected');
          break;

        case 'restrict':
          await this.restrictUserAccess(violation.userId, action.duration);
          this.showWarningMessage(action.message || 'Access temporarily restricted');
          break;

        case 'terminate':
          await this.terminateSession(violation.userId);
          this.showCriticalMessage(action.message || 'Session terminated for security violation');
          break;

        case 'block':
          await this.blockUser(violation.userId, action.duration);
          this.showCriticalMessage(action.message || 'Access blocked due to security violation');
          break;

        case 'report':
          await this.reportToAdministrators(violation, action.message);
          break;
      }

      // Log enforcement action
      await this.logEnforcementAction(action, violation);

    } catch (error) {
      console.error('Failed to execute enforcement action:', error);
    }
  }

  private showWarningMessage(message: string): void {
    toast.warning(message, { duration: 8000 });
  }

  private showCriticalMessage(message: string): void {
    toast.error(message, { duration: 15000 });
  }

  private async restrictUserAccess(userId?: string, duration?: number): Promise<void> {
    if (!userId) return;

    // Create temporary access restriction
    await supabase.from('user_permissions').insert({
      user_id: userId,
      permission_type: 'access_restriction',
      resource_type: 'system',
      metadata: {
        restriction_type: 'temporary',
        duration: duration,
        created_at: Date.now()
      },
      expires_at: duration ? new Date(Date.now() + duration).toISOString() : null,
      is_active: true
    });
  }

  private async terminateSession(userId?: string): Promise<void> {
    try {
      // Sign out current user
      await supabase.auth.signOut();
      
      // Redirect to login with security message
      setTimeout(() => {
        window.location.href = '/login?reason=security_violation';
      }, 2000);
    } catch (error) {
      console.error('Failed to terminate session:', error);
      // Force page reload as fallback
      window.location.reload();
    }
  }

  private async blockUser(userId?: string, duration?: number): Promise<void> {
    if (!userId) return;

    await supabase.from('user_permissions').insert({
      user_id: userId,
      permission_type: 'access_block',
      resource_type: 'system',
      metadata: {
        block_type: 'security_violation',
        duration: duration,
        blocked_at: Date.now()
      },
      expires_at: duration ? new Date(Date.now() + duration).toISOString() : null,
      is_active: true
    });

    // Also terminate current session
    await this.terminateSession(userId);
  }

  private async reportToAdministrators(violation: SecurityViolation, message?: string): Promise<void> {
    await supabase.from('security_alerts').insert({
      alert_type: 'policy_violation',
      severity: violation.severity,
      title: `Security Policy Violation: ${violation.violationType}`,
      description: message || `Policy violation detected for policy ${violation.policyId}`,
      user_id: violation.userId,
      ip_address: violation.ipAddress,
      metadata: {
        policy_id: violation.policyId,
        violation_details: violation.details,
        user_agent: violation.userAgent,
        timestamp: violation.timestamp,
        requires_admin_review: true
      }
    });
  }

  private async logSecurityViolation(violation: SecurityViolation): Promise<void> {
    await supabase.rpc('comprehensive_audit_log', {
      _action: 'security_policy_violation',
      _resource_type: 'security_policy',
      _resource_id: violation.policyId,
      _new_data: {
        violation_type: violation.violationType,
        severity: violation.severity,
        details: violation.details,
        policy_id: violation.policyId
      },
      _risk_level: violation.severity,
      _compliance_tags: ['policy_enforcement', 'security_violation']
    });
  }

  private async logEnforcementAction(action: EnforcementAction, violation: SecurityViolation): Promise<void> {
    await supabase.rpc('comprehensive_audit_log', {
      _action: 'security_enforcement_action',
      _resource_type: 'security_system',
      _new_data: {
        action_type: action.type,
        policy_id: violation.policyId,
        violation_type: violation.violationType,
        immediate: action.immediate,
        duration: action.duration,
        message: action.message
      },
      _risk_level: violation.severity,
      _compliance_tags: ['enforcement', 'automated_response']
    });
  }

  private async processEnforcementQueue(): Promise<void> {
    if (this.enforcementQueue.length === 0) return;

    this.isEnforcing = true;
    
    try {
      const batch = this.enforcementQueue.splice(0, 10); // Process in batches
      
      for (const violation of batch) {
        const actions = await this.determineEnforcementActions(violation);
        const delayedActions = actions.filter(action => !action.immediate);
        
        for (const action of delayedActions) {
          await this.executeEnforcementAction(action, violation);
          // Small delay between actions to prevent overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Enforcement queue processing failed:', error);
    } finally {
      this.isEnforcing = false;
    }
  }

  private cleanupOldViolations(): void {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    
    // Clean up old violation counts (keep only recent violations)
    for (const [key, _] of this.violationCounts) {
      // This is simplified - in a real implementation, you'd track timestamps
      // and remove only truly old violations
    }
  }

  // Public methods for manual enforcement
  public async enablePolicy(policyId: string): Promise<void> {
    const policy = this.policies.get(policyId);
    if (policy) {
      policy.enabled = true;
      this.policies.set(policyId, policy);
    }
  }

  public async disablePolicy(policyId: string): Promise<void> {
    const policy = this.policies.get(policyId);
    if (policy) {
      policy.enabled = false;
      this.policies.set(policyId, policy);
    }
  }

  public getPolicyStatus(): SecurityPolicy[] {
    return Array.from(this.policies.values());
  }

  public getViolationCounts(): Map<string, number> {
    return new Map(this.violationCounts);
  }

  public async emergencyLockdown(): Promise<void> {
    // Disable all non-critical access
    toast.error("EMERGENCY LOCKDOWN ACTIVATED - All non-essential access suspended");
    
    // Log emergency event
    await supabase.rpc('comprehensive_audit_log', {
      _action: 'emergency_lockdown',
      _resource_type: 'security_system',
      _risk_level: 'critical',
      _compliance_tags: ['emergency_response', 'system_lockdown']
    });

    // Redirect to secure page
    window.location.href = '/login?reason=emergency_lockdown';
  }
}

export const maxSecurityEnforcement = MaxSecurityEnforcement.getInstance();
