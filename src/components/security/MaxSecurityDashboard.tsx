import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMaxSecurityMonitor } from '@/hooks/useMaxSecurityMonitor';
import { maxSecurityEnforcement } from '@/services/maxSecurityEnforcement';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Zap,
  Activity,
  TrendingUp,
  Users,
  Server,
  Wifi,
  File,
  Ban,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const MaxSecurityDashboard: React.FC = () => {
  const { securityStatus, isMonitoring, loading, userBehavior, actions } = useMaxSecurityMonitor();
  const [enforcementPolicies] = useState(maxSecurityEnforcement.getPolicyStatus());
  const [violationCounts] = useState(maxSecurityEnforcement.getViolationCounts());

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i} className="h-64">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
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
      <Card className="border-red-300">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-700 mb-2">Security System Offline</h3>
          <p className="text-red-600 mb-4">
            Maximum security monitoring is currently unavailable. This may indicate a critical system issue.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={actions.refreshStatus} variant="outline" className="border-red-300">
              Retry Connection
            </Button>
            <Button onClick={actions.emergencyLockdown} variant="destructive">
              Emergency Lockdown
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSystemStatusColor = (status: typeof securityStatus.systemStatus) => {
    switch (status) {
      case 'optimal': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-amber-600 bg-amber-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'compromised': return 'text-red-800 bg-red-200 animate-pulse';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600';
      case 'MEDIUM': return 'text-amber-600';
      case 'HIGH': return 'text-red-600';
      case 'CRITICAL': return 'text-red-800 animate-pulse';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Critical Status Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-red-800">
              <Shield className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">MAXIMUM SECURITY</div>
                <div className="text-sm font-normal text-red-600">Real-time Protection Active</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-red-700 font-medium">Security Score</span>
                <span className={`text-3xl font-bold ${getThreatLevelColor(securityStatus.metrics.overallThreatLevel.level)}`}>
                  {securityStatus.securityScore}/100
                </span>
              </div>
              <Progress value={securityStatus.securityScore} className="h-3" />
              <div className={`px-3 py-2 rounded-lg text-center font-bold ${getSystemStatusColor(securityStatus.systemStatus)}`}>
                {securityStatus.systemStatus.toUpperCase()} STATUS
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              Threat Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Threat Level</span>
                <Badge className={`${getThreatLevelColor(securityStatus.metrics.overallThreatLevel.level)} border font-bold`} variant="outline">
                  {securityStatus.metrics.overallThreatLevel.level}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Threats</span>
                <Badge variant={securityStatus.activeThreats.length > 0 ? 'destructive' : 'default'}>
                  {securityStatus.activeThreats.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Critical Alerts</span>
                <Badge variant={securityStatus.activeThreats.filter(t => t.severity === 'critical').length > 0 ? 'destructive' : 'secondary'}>
                  {securityStatus.activeThreats.filter(t => t.severity === 'critical').length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-600" />
              Monitoring Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Real-time Monitoring</span>
                <div className="flex items-center gap-2">
                  {isMonitoring ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={isMonitoring ? 'text-green-600' : 'text-red-600'}>
                    {isMonitoring ? 'Active' : 'Offline'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>AI Analysis</span>
                <Badge variant="default" className="bg-blue-600">
                  Advanced
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Auto-Enforcement</span>
                <Badge variant="default" className="bg-green-600">
                  Enabled
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Session Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStatus.metrics.sessionSecurity}%</div>
            <Progress value={securityStatus.metrics.sessionSecurity} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              Network Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStatus.metrics.networkSecurity}%</div>
            <Progress value={securityStatus.metrics.networkSecurity} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Behavioral Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStatus.metrics.behavioralSecurity}%</div>
            <Progress value={securityStatus.metrics.behavioralSecurity} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Content Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStatus.metrics.contentSecurity}%</div>
            <Progress value={securityStatus.metrics.contentSecurity} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Active Threats & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Active Threats
            </CardTitle>
            <CardDescription>Real-time security threats requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {securityStatus.activeThreats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <div className="font-medium">No Active Threats</div>
                <div className="text-sm">All security parameters are within normal ranges</div>
              </div>
            ) : (
              <div className="space-y-3">
                {securityStatus.activeThreats.map((threat) => (
                  <Alert key={threat.id} className={`border-l-4 ${
                    threat.severity === 'critical' ? 'border-l-red-600 bg-red-50' :
                    threat.severity === 'high' ? 'border-l-orange-500 bg-orange-50' :
                    threat.severity === 'medium' ? 'border-l-amber-500 bg-amber-50' :
                    'border-l-blue-500 bg-blue-50'
                  }`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium">{threat.message}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(threat.timestamp)} ago • {threat.type}
                          </div>
                        </div>
                        <Badge variant={
                          threat.severity === 'critical' ? 'destructive' :
                          threat.severity === 'high' ? 'destructive' :
                          threat.severity === 'medium' ? 'default' : 'secondary'
                        } className="ml-2">
                          {threat.severity}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <TrendingUp className="h-5 w-5" />
              Security Recommendations
            </CardTitle>
            <CardDescription>AI-powered security improvement suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityStatus.recommendedActions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="text-sm text-blue-800">{action}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Behavior Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Real-time Behavior Analysis
          </CardTitle>
          <CardDescription>Advanced user behavior monitoring and anomaly detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Click Pattern</span>
                <Badge variant="outline">{userBehavior.clickPattern.length} clicks</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Keystroke Pattern</span>
                <Badge variant="outline">{userBehavior.keystrokePattern.length} keys</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Scroll Activity</span>
                <Badge variant="outline">{userBehavior.scrollPattern.length} scrolls</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Session Duration</span>
                <Badge variant="outline">
                  {Math.floor(userBehavior.sessionDuration / (1000 * 60))} mins
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Navigation Pattern</span>
                <Badge variant="outline">{userBehavior.navigationPattern.length} pages</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Security Violations</span>
                <Badge variant={userBehavior.suspiciousActivities > 0 ? 'destructive' : 'default'}>
                  {userBehavior.suspiciousActivities}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <div className="font-medium mb-1">Behavioral Analysis Active</div>
                  <div className="text-xs text-amber-700">
                    All user interactions are being monitored and analyzed for security purposes.
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Controls */}
      <Card className="border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Ban className="h-5 w-5" />
            Emergency Security Controls
          </CardTitle>
          <CardDescription className="text-red-600">
            Critical security controls for immediate threat response
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-100"
              onClick={actions.refreshStatus}
            >
              <Activity className="w-4 h-4 mr-2" />
              Force Security Scan
            </Button>
            
            <Button 
              variant="destructive"
              onClick={actions.emergencyLockdown}
              className="bg-red-600 hover:bg-red-700"
            >
              <Lock className="w-4 h-4 mr-2" />
              Emergency Lockdown
            </Button>
            
            <Button 
              variant="outline" 
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
              disabled
            >
              <Server className="w-4 h-4 mr-2" />
              System Quarantine
            </Button>
          </div>
          
          <Alert className="mt-4 border-red-300 bg-red-100">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> Emergency controls will immediately affect all users and system operations. 
              Use only when facing confirmed security threats.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};