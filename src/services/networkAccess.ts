interface NetworkStatus {
  isIntranet: boolean;
  isTestMode: boolean;
  isDevelopment: boolean;
  networkType: 'intranet' | 'external' | 'development';
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

  // New method for PDF access control
  async canAccessPDFsNow(): Promise<{ allowed: boolean; reason: string }> {
    const status = await this.getNetworkStatus();
    
    if (!status.isIntranet) {
      return {
        allowed: false,
        reason: 'Network access restricted - Connect to LRC intranet to access thesis documents'
      };
    }
    
    return { allowed: true, reason: 'Access granted' };
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
    // This would be implemented with actual network checking logic
    // For now, we'll use a placeholder that checks IP ranges or calls an edge function
    
    // In a real implementation, you might:
    // 1. Check against known IP ranges for your institution
    // 2. Call a Supabase Edge Function that does server-side IP checking
    // 3. Check for specific network characteristics
    
    return false; // Default to external access for security
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