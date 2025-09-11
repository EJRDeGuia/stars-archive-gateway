import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEnhancedSecurity } from '@/hooks/useEnhancedSecurity';
import { 
  Shield, 
  Database, 
  Clock, 
  FileImage, 
  AlertTriangle, 
  CheckCircle, 
  HardDrive,
  Download,
  Scan
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const SecurityDashboard: React.FC = () => {
  const {
    securityStatus,
    isLoading,
    createBackup,
    extendSession,
    performSecurityScan,
    refreshSecurityStatus
  } = useEnhancedSecurity();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="h-48">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!securityStatus) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Security Status Unavailable</h3>
          <p className="text-muted-foreground mb-4">
            Unable to load security status. Please try refreshing.
          </p>
          <Button onClick={refreshSecurityStatus}>
            Refresh Status
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getSecurityScore = () => {
    let score = 0;
    
    // Backup score (25 points)
    if (securityStatus.backups.total > 0) score += 25;
    
    // Session security score (25 points)
    if (!securityStatus.session.expired) score += 25;
    
    // Watermark score (25 points)
    if (securityStatus.watermarks.active > 0) score += 25;
    
    // Alert score (25 points)
    if (securityStatus.security_alerts.high_priority === 0) score += 25;
    
    return score;
  };

  const securityScore = getSecurityScore();
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Security Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Score
          </CardTitle>
          <CardDescription>
            Overall security posture and compliance status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold">Overall Security</span>
            <span className={`text-3xl font-bold ${getScoreColor(securityScore)}`}>
              {securityScore}/100
            </span>
          </div>
          <Progress value={securityScore} className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold">Backup Status</div>
              <Badge variant={securityStatus.backups.total > 0 ? 'default' : 'destructive'}>
                {securityStatus.backups.total > 0 ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="font-semibold">Session Security</div>
              <Badge variant={!securityStatus.session.expired ? 'default' : 'destructive'}>
                {!securityStatus.session.expired ? 'Secure' : 'Expired'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="font-semibold">Watermarks</div>
              <Badge variant={securityStatus.watermarks.active > 0 ? 'default' : 'secondary'}>
                {securityStatus.watermarks.active} Active
              </Badge>
            </div>
            <div className="text-center">
              <div className="font-semibold">Security Alerts</div>
              <Badge variant={securityStatus.security_alerts.high_priority === 0 ? 'default' : 'destructive'}>
                {securityStatus.security_alerts.high_priority} High
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup & Recovery
            </CardTitle>
            <CardDescription>
              Automated backup system and recovery management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Backups</span>
              <Badge variant="outline">{securityStatus.backups.total}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Backup</span>
              <span className="text-sm text-muted-foreground">
                {securityStatus.backups.last_backup !== 'Never' 
                  ? formatDistanceToNow(new Date(securityStatus.backups.last_backup), { addSuffix: true })
                  : 'Never'
                }
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => createBackup('incremental')}
                className="flex items-center gap-1"
              >
                <HardDrive className="h-4 w-4" />
                Create Backup
              </Button>
              <Button size="sm" variant="ghost" onClick={refreshSecurityStatus}>
                Refresh
              </Button>
            </div>
            {securityStatus.backups.recent.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Backups</h4>
                {securityStatus.backups.recent.map((backup: any, index: number) => (
                  <div key={backup.id || index} className="flex justify-between text-xs p-2 bg-muted rounded">
                    <span>{backup.backup_type}</span>
                    <span>{formatDistanceToNow(new Date(backup.created_at), { addSuffix: true })}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Session Security
            </CardTitle>
            <CardDescription>
              Session timeout and security monitoring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Session Status</span>
              <Badge variant={!securityStatus.session.expired ? 'default' : 'destructive'}>
                {!securityStatus.session.expired ? 'Active' : 'Expired'}
              </Badge>
            </div>
            
            {!securityStatus.session.expired && (
              <>
                {securityStatus.session.expires_in_minutes && (
                  <div className="flex justify-between items-center">
                    <span>Expires In</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.floor(securityStatus.session.expires_in_minutes)} minutes
                    </span>
                  </div>
                )}
                
                {securityStatus.session.inactive_minutes && (
                  <div className="flex justify-between items-center">
                    <span>Inactive For</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.floor(securityStatus.session.inactive_minutes)} minutes
                    </span>
                  </div>
                )}
                
                {securityStatus.session.warning && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Session Warning</span>
                    </div>
                    <p className="text-xs text-amber-600 mt-1">
                      Your session will expire soon due to inactivity
                    </p>
                  </div>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => extendSession(120)}
                  className="w-full"
                >
                  Extend Session (2 hours)
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Watermark Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Content Protection
            </CardTitle>
            <CardDescription>
              Watermarking and content security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Watermarks</span>
              <Badge variant="outline">{securityStatus.watermarks.total}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Watermarks</span>
              <Badge variant={securityStatus.watermarks.active > 0 ? 'default' : 'secondary'}>
                {securityStatus.watermarks.active}
              </Badge>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Protection Status</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                {securityStatus.watermarks.active > 0 
                  ? 'Content protection is active'
                  : 'No active watermarks'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Alerts
            </CardTitle>
            <CardDescription>
              Real-time security monitoring and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Alerts</span>
              <Badge variant="outline">{securityStatus.security_alerts.total}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>High Priority</span>
              <Badge variant={securityStatus.security_alerts.high_priority === 0 ? 'default' : 'destructive'}>
                {securityStatus.security_alerts.high_priority}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={performSecurityScan}
                className="flex items-center gap-1"
              >
                <Scan className="h-4 w-4" />
                Security Scan
              </Button>
              <Button size="sm" variant="ghost" onClick={refreshSecurityStatus}>
                Refresh
              </Button>
            </div>

            {securityStatus.security_alerts.recent.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Alerts</h4>
                {securityStatus.security_alerts.recent.map((alert: any, index: number) => (
                  <div key={alert.id || index} className="text-xs p-2 bg-muted rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{alert.title}</span>
                      <Badge 
                        variant={
                          alert.severity === 'high' ? 'destructive' : 
                          alert.severity === 'medium' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">{alert.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};