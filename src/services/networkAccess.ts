import { supabase } from '@/integrations/supabase/client';

interface NetworkStatus {
  isIntranet: boolean;
  isTestMode: boolean;
  isDevelopment: boolean;
  networkType: 'intranet' | 'external' | 'development';
  clientIP?: string;
  reason?: string;
}

interface NetworkCheckResponse {
  allowed: boolean;
  reason: string;
  networkType: 'authorized' | 'external' | 'localhost';
  clientIP: string;
  timestamp: string;
}

export class NetworkAccessService {
  private static instance: NetworkAccessService;
  private cachedStatus: NetworkStatus | null = null;
  private lastCheck: number = 0;
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  static getInstance(): NetworkAccessService {
    if (!this.instance) {
      this.instance = new NetworkAccessService();
    }
    return this.instance;
  }

  async getNetworkStatus(): Promise<NetworkStatus> {
    const now = Date.now();
    
    // Return cached status if still valid
    if (this.cachedStatus && (now - this.lastCheck) < this.cacheTimeout) {
      return this.cachedStatus;
    }

    const status = await this.checkNetworkAccess();
    this.cachedStatus = status;
    this.lastCheck = now;
    
    return status;
  }

  // New method for PDF access control with detailed network information
  async canAccessPDFsNow(): Promise<{ 
    allowed: boolean; 
    reason: string; 
    networkType?: string;
    clientIP?: string;
  }> {
    const status = await this.getNetworkStatus();
    
    if (!status.isIntranet) {
      return {
        allowed: false,
        reason: status.reason || 'Access restricted: Please connect to the authorized Wi-Fi to view this content.',
        networkType: status.networkType,
        clientIP: status.clientIP
      };
    }
    
    return { 
      allowed: true, 
      reason: status.reason || 'Access granted from authorized network',
      networkType: status.networkType,
      clientIP: status.clientIP
    };
  }

  private async checkNetworkAccess(): Promise<NetworkStatus> {
    // Check for development environment
    const isDevelopment = this.isDevelopmentEnvironment();
    
    // Check for test mode bypass
    const isTestMode = this.isTestModeEnabled();
    
    // If development or test mode, allow access
    if (isDevelopment || isTestMode) {
      return {
        isIntranet: true,
        isTestMode,
        isDevelopment,
        networkType: isDevelopment ? 'development' : 'intranet'
      };
    }

    // In production, check actual network access
    try {
      const isIntranet = await this.checkIntranetAccess();
      return {
        isIntranet,
        isTestMode: false,
        isDevelopment: false,
        networkType: isIntranet ? 'intranet' : 'external'
      };
    } catch (error) {
      console.warn('Network check failed, assuming external access:', error);
      return {
        isIntranet: false,
        isTestMode: false,
        isDevelopment: false,
        networkType: 'external'
      };
    }
  }

  private isDevelopmentEnvironment(): boolean {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('lovable') ||
      window.location.hostname.includes('vercel.app') ||
      process.env.NODE_ENV === 'development'
    );
  }

  private isTestModeEnabled(): boolean {
    return (
      window.location.search.includes('testing=true') ||
      localStorage.getItem('bypassNetworkCheck') === 'true' ||
      sessionStorage.getItem('testMode') === 'true'
    );
  }

  private async checkIntranetAccess(): Promise<boolean> {
    try {
      // Call the Supabase Edge Function for server-side IP verification
      const { data, error } = await supabase.functions.invoke('network-access-check', {
        body: {
          forceCheck: true,
          userAgent: navigator.userAgent
        }
      });

      if (error) {
        console.error('Network access check failed:', error);
        return false; // Default to deny access for security
      }

      const response = data as NetworkCheckResponse;
      console.log('Network access check result:', response);

      // Cache the network information
      if (this.cachedStatus) {
        this.cachedStatus.clientIP = response.clientIP;
        this.cachedStatus.reason = response.reason;
      }

      return response.allowed;
    } catch (error) {
      console.error('Failed to verify network access:', error);
      return false; // Default to deny access for security
    }
  }

  enableTestMode(): void {
    localStorage.setItem('bypassNetworkCheck', 'true');
    this.clearCache();
  }

  disableTestMode(): void {
    localStorage.removeItem('bypassNetworkCheck');
    sessionStorage.removeItem('testMode');
    this.clearCache();
  }

  clearCache(): void {
    this.cachedStatus = null;
    this.lastCheck = 0;
  }

  canAccessPDFs(): Promise<boolean> {
    return this.getNetworkStatus().then(status => status.isIntranet);
  }

  shouldShowNetworkIndicator(): Promise<boolean> {
    return this.getNetworkStatus().then(status => 
      status.isIntranet && !status.isDevelopment
    );
  }
}

export const networkAccessService = NetworkAccessService.getInstance();