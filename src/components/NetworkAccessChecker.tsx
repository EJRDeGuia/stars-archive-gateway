
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

interface NetworkAccessCheckerProps {
  children: React.ReactNode;
}

const NetworkAccessChecker: React.FC<NetworkAccessCheckerProps> = ({ children }) => {
  const [isIntranetAccess, setIsIntranetAccess] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkNetworkAccess = async () => {
      try {
        // Check if user is accessing from LRC intranet
        // This is a simplified check - in production, you'd verify against known IP ranges
        const response = await fetch('/api/check-network', { 
          method: 'GET',
          headers: { 'X-Network-Check': 'true' }
        }).catch(() => null);

        // For demo purposes, we'll simulate intranet access based on localhost
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.includes('lovable');
        
        setIsIntranetAccess(isLocalhost);
      } catch (error) {
        // Network check failed, assuming external access for security
        setIsIntranetAccess(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkNetworkAccess();
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

  if (!isIntranetAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="max-w-md w-full border-orange-200 bg-orange-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <WifiOff className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-orange-900 mb-4">Restricted Access</h2>
            <p className="text-orange-700 mb-6">
              Access to thesis documents is restricted to users connected to the De La Salle Lipa University Learning Resource Center (LRC) intranet.
            </p>
            <div className="bg-orange-100 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Network Access Required</span>
              </div>
              <p className="text-sm text-orange-700 mt-2">
                Please connect to the LRC network to access thesis materials.
              </p>
            </div>
            <p className="text-sm text-orange-600">
              Contact the LRC staff for assistance with network access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default NetworkAccessChecker;
