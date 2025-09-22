import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TestTube, Wifi } from 'lucide-react';
import { networkAccessService } from '@/services/networkAccess';

const TestingModeToggle: React.FC = () => {
  const isTestingMode = localStorage.getItem('bypassNetworkCheck') === 'true';

  const toggleTestingMode = () => {
    if (isTestingMode) {
      networkAccessService.disableTestMode();
    } else {
      networkAccessService.enableTestMode();
    }
    window.location.reload();
  };

  return (
    <Card className="fixed bottom-4 right-4 z-50 max-w-xs">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isTestingMode ? 'bg-green-100' : 'bg-gray-100'}`}>
            {isTestingMode ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <TestTube className="w-4 h-4 text-gray-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {isTestingMode ? 'Testing Mode ON' : 'Testing Mode OFF'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isTestingMode ? 'Network restrictions bypassed' : 'Normal network checking'}
            </p>
          </div>
        </div>
        <Button 
          onClick={toggleTestingMode}
          variant={isTestingMode ? 'destructive' : 'default'}
          size="sm"
          className="w-full mt-3"
        >
          {isTestingMode ? 'Disable' : 'Enable'} Testing
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestingModeToggle;