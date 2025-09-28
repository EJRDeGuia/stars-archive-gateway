
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { networkAccessService } from '@/services/networkAccess';

interface NetworkAccessCheckerProps {
  children: React.ReactNode;
}

const NetworkAccessChecker: React.FC<NetworkAccessCheckerProps> = ({ children }) => {
  const [accessInfo, setAccessInfo] = useState<{
    allowed: boolean;
    reason: string;
    networkType?: string;
    clientIP?: string;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkNetworkAccess = async () => {
      try {
        const accessResult = await networkAccessService.canAccessPDFsNow();
        setAccessInfo(accessResult);
      } catch (error) {
        console.error('Network access check failed:', error);
        // Network check failed, assuming external access for security
        setAccessInfo({
          allowed: false,
          reason: 'Network verification failed. Please check your connection and try again.',
          networkType: 'external'
        });
      } finally {
        setIsChecking(false);
      }
    };

    checkNetworkAccess();
    
    // Re-check network access every 5 minutes
    const interval = setInterval(checkNetworkAccess, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-dlsl-green mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying network access...</p>
        </div>
      </div>
    );
  }

  if (accessInfo && !accessInfo.allowed) {
    const isTestMode = localStorage.getItem('bypassNetworkCheck') === 'true';
    
    // If test mode is enabled, allow access but show a warning indicator
    if (isTestMode) {
      return (
        <div className="relative">
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-amber-100 border border-amber-300 rounded-lg p-3 shadow-lg">
            <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Testing Mode: Wi-Fi restrictions bypassed
            </p>
          </div>
          {children}
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="max-w-md w-full border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <WifiOff className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-900 mb-4">Wi-Fi Access Restricted</h2>
            <p className="text-red-700 mb-6">
              {accessInfo.reason}
            </p>
            
            <div className="bg-red-100 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Authorized Wi-Fi Required</span>
              </div>
              <p className="text-sm text-red-700">
                Please connect to the De La Salle Lipa University Learning Resource Center (LRC) Wi-Fi network to access thesis materials.
              </p>
            </div>

            {accessInfo.clientIP && (
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Your IP:</span> {accessInfo.clientIP}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Network Type:</span> {accessInfo.networkType || 'External'}
                </p>
              </div>
            )}

            {isTestMode && (
              <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 mb-4">
                <p className="text-sm text-amber-800 font-medium">
                  ⚠️ Testing Mode Active
                </p>
                <p className="text-xs text-amber-700">
                  Wi-Fi restrictions are currently bypassed for testing
                </p>
              </div>
            )}
            
            <p className="text-sm text-red-600">
              Contact the LRC staff for assistance with network access or if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default NetworkAccessChecker;
