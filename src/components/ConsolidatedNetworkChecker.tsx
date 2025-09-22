import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Wifi, WifiOff, Shield } from 'lucide-react';
import { networkAccessService } from '@/services/networkAccess';

interface ConsolidatedNetworkCheckerProps {
  children: React.ReactNode;
  requireIntranet?: boolean;
}

const ConsolidatedNetworkChecker: React.FC<ConsolidatedNetworkCheckerProps> = ({ 
  children, 
  requireIntranet = false 
}) => {
  const [networkStatus, setNetworkStatus] = useState<{
    isIntranet: boolean;
    isTestMode: boolean;
    isDevelopment: boolean;
    networkType: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const status = await networkAccessService.getNetworkStatus();
        setNetworkStatus(status);
        setError(null);
      } catch (err) {
        console.error('Network status check failed:', err);
        setError('Failed to verify network access');
      } finally {
        setIsLoading(false);
      }
    };

    checkNetworkStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-dlsl-green mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying network access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="max-w-md w-full border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-900 mb-4">Network Error</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requireIntranet && !networkStatus?.isIntranet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="max-w-md w-full border-orange-200 bg-orange-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <WifiOff className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-orange-900 mb-4">Restricted Access</h2>
            <p className="text-orange-700 mb-6">
              Access to thesis documents is restricted to users connected to the De La Salle Lipa University Learning Resource Center (LRC) intranet network.
            </p>
            <div className="bg-orange-100 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-orange-800">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Security Notice</span>
              </div>
              <p className="text-sm text-orange-700 mt-2">
                This restriction protects intellectual property and ensures compliance with institutional policies.
              </p>
            </div>
            <p className="text-sm text-orange-600">
              Contact the LRC staff for assistance with network access or to request alternative access methods.
            </p>
            {networkStatus?.isTestMode && (
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Test Mode:</strong> Network restrictions are currently bypassed for testing purposes.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show network status indicator for intranet users
  if (networkStatus?.isIntranet && !networkStatus?.isDevelopment) {
    return (
      <div className="relative">
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-100 border border-green-200 rounded-lg px-3 py-2 shadow-sm">
            <div className="flex items-center gap-2 text-green-800">
              <Wifi className="w-4 h-4" />
              <span className="text-sm font-medium">
                {networkStatus.isTestMode ? 'Test Mode' : 'LRC Network'}
              </span>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default ConsolidatedNetworkChecker;