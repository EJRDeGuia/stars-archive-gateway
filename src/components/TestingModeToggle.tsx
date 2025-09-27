import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TestTube, Wifi, ShieldAlert } from 'lucide-react';
import { networkAccessService } from '@/services/networkAccess';
import { useAuth } from '@/contexts/AuthContext';

const TestingModeToggle: React.FC = () => {
  const { user } = useAuth();
  const isTestingMode = localStorage.getItem('bypassNetworkCheck') === 'true';

  // Only show to admins and archivists
  const canUseToggle = user && ['admin', 'archivist'].includes(user.role);

  const toggleTestingMode = () => {
    if (!canUseToggle) {
      alert('Access denied: Only administrators and archivists can use the network bypass toggle.');
      return;
    }

    if (isTestingMode) {
      networkAccessService.disableTestMode();
    } else {
      networkAccessService.enableTestMode();
    }
    window.location.reload();
  };

  // Don't render if user doesn't have permission
  if (!canUseToggle) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 max-w-xs shadow-lg border-2 border-amber-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isTestingMode ? 'bg-green-100' : 'bg-amber-100'}`}>
            {isTestingMode ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {isTestingMode ? 'Wi-Fi Bypass ON' : 'Wi-Fi Bypass OFF'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isTestingMode ? 'Network restrictions bypassed' : 'Network restrictions active'}
            </p>
          </div>
        </div>
        
        <div className="mt-3 p-2 bg-amber-50 rounded-lg">
          <p className="text-xs text-amber-700 font-medium flex items-center gap-1">
            <TestTube className="w-3 h-3" />
            Admin Testing Tool
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Bypasses Wi-Fi restrictions for testing purposes
          </p>
        </div>
        
        <Button 
          onClick={toggleTestingMode}
          variant={isTestingMode ? 'destructive' : 'default'}
          size="sm"
          className="w-full mt-3"
        >
          {isTestingMode ? 'Disable' : 'Enable'} Wi-Fi Bypass
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestingModeToggle;