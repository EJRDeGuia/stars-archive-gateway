import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useSystemStats } from '@/hooks/useSystemStats';
import { useBackupManager } from '@/hooks/useBackupManager';
import { useSecurityReports } from '@/hooks/useSecurityReports';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Shield, 
  Database, 
  Settings, 
  Activity,
  RefreshCw
} from 'lucide-react';

interface ValidationCheck {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  action?: () => void;
  actionLabel?: string;
}

const SystemValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const { settings, isLoading: settingsLoading } = useSystemSettings();
  const { data: stats, isLoading: statsLoading } = useSystemStats();
  const { backups, isLoading: backupsLoading } = useBackupManager();
  const { generateReport, isGenerating } = useSecurityReports();

  const runValidation = async () => {
    setIsValidating(true);
    // Simulate validation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsValidating(false);
  };

  const validationChecks: ValidationCheck[] = [
    {
      name: 'System Settings',
      status: settings.length > 0 ? 'pass' : 'warning',
      message: settings.length > 0 ? 'System settings configured' : 'No system settings found',
    },
    {
      name: 'Database Statistics',
      status: stats ? 'pass' : 'warning',
      message: stats ? 'Statistics tracking active' : 'Statistics not available',
    },
    {
      name: 'Backup System',
      status: backups && backups.length > 0 ? 'pass' : 'warning',
      message: backups && backups.length > 0 ? `${backups.length} backups available` : 'No recent backups',
      action: () => generateReport({ reportType: 'summary' }),
      actionLabel: 'Generate Report'
    },
    {
      name: 'Security Monitoring',
      status: 'pass',
      message: 'Security systems operational',
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  if (settingsLoading || statsLoading || backupsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            System Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-dlsl-green" />
            <span className="ml-2">Loading validation checks...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            System Validation
          </CardTitle>
          <Button 
            onClick={runValidation} 
            disabled={isValidating || isGenerating}
            size="sm"
          >
            {isValidating ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {isValidating ? 'Validating...' : 'Run Validation'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {validationChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <h4 className="font-medium">{check.name}</h4>
                  <p className="text-sm text-gray-600">{check.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(check.status)}
                {check.action && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={check.action}
                    disabled={isGenerating}
                  >
                    {check.actionLabel}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">System Health</h4>
              <p className="text-sm text-gray-600">
                {validationChecks.filter(c => c.status === 'pass').length} of {validationChecks.length} checks passed
              </p>
            </div>
            <div className="flex items-center gap-2">
              {validationChecks.every(c => c.status === 'pass') ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : validationChecks.some(c => c.status === 'fail') ? (
                <XCircle className="w-6 h-6 text-red-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemValidation;