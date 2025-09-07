import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';

interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: string;
  alert_type: string;
  created_at: string;
  resolved: boolean;
  user_id?: string;
  ip_address?: string;
  metadata?: any;
}

interface SecurityAlertsPanelProps {
  alerts: SecurityAlert[];
  loading: boolean;
  onResolveAlert: (alertId: string) => void;
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'high':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'medium':
      return <Shield className="w-4 h-4 text-yellow-500" />;
    case 'low':
      return <Clock className="w-4 h-4 text-blue-500" />;
    default:
      return <Shield className="w-4 h-4 text-gray-500" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const SecurityAlertsPanel: React.FC<SecurityAlertsPanelProps> = ({
  alerts,
  loading,
  onResolveAlert
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Security Alerts
          {unresolvedAlerts.length > 0 && (
            <Badge className="bg-red-100 text-red-800 border-red-200">
              {unresolvedAlerts.length} unresolved
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>No security alerts</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 ${
                  alert.resolved ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        {alert.resolved && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Type:</span> {alert.alert_type}
                        {alert.ip_address && (
                          <>
                            {' • '}
                            <span className="font-medium">IP:</span> {alert.ip_address}
                          </>
                        )}
                        {' • '}
                        <span className="font-medium">Time:</span> {new Date(alert.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onResolveAlert(alert.id)}
                      className="ml-2"
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAlertsPanel;