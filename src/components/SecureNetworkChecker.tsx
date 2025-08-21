
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Wifi, WifiOff, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SecureNetworkCheckerProps {
  children: React.ReactNode;
  requireIntranet?: boolean;
}

const SecureNetworkChecker: React.FC<SecureNetworkCheckerProps> = ({ 
  children, 
  requireIntranet = false 
}) => {
  const [networkStatus, setNetworkStatus] = useState<'checking' | 'intranet' | 'external' | 'error'>('checking');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkNetworkAccess = async () => {
      try {
        // For development and Lovable environment, simulate intranet access
        const isDevelopment = window.location.hostname === 'localhost' || 
                             window.location.hostname === '127.0.0.1' ||
                             window.location.hostname.includes('lovable') ||
                             window.location.hostname.includes('vercel.app');
        
        if (isDevelopment) {
          setNetworkStatus('intranet');
          setIsLoading(false);
          return;
        }

        // In production, we would check against known IP ranges
        // For now, we'll call an edge function that can do server-side IP checking
        try {
          const { data, error } = await supabase.functions.invoke('check-network-access', {
            headers: {
              'X-Client-IP': 'check'
            }
          });

          if (error) {
            console.warn('Network check failed, assuming external access:', error);
            setNetworkStatus('external');
          } else {
            setNetworkStatus(data?.isIntranet ? 'intranet' : 'external');
          }
        } catch (error) {
          console.warn('Network check error, assuming external access:', error);
          setNetworkStatus('external');
        }
      } catch (error) {
        console.error('Network check failed:', error);
        setNetworkStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    checkNetworkAccess();
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

  if (requireIntranet && networkStatus !== 'intranet') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="max-w-md w-full border-orange-200 bg-orange-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              {networkStatus === 'error' ? (
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              ) : (
                <WifiOff className="w-8 h-8 text-orange-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-orange-900 mb-4">
              {networkStatus === 'error' ? 'Network Error' : 'Restricted Access'}
            </h2>
            <p className="text-orange-700 mb-6">
              {networkStatus === 'error' 
                ? 'Unable to verify network access. Please check your connection and try again.'
                : 'Access to thesis documents is restricted to users connected to the De La Salle Lipa University Learning Resource Center (LRC) intranet network.'
              }
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
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show network status indicator for intranet users
  if (networkStatus === 'intranet') {
    return (
      <div className="relative">
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-100 border border-green-200 rounded-lg px-3 py-2 shadow-sm">
            <div className="flex items-center gap-2 text-green-800">
              <Wifi className="w-4 h-4" />
              <span className="text-sm font-medium">LRC Network</span>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default SecureNetworkChecker;
