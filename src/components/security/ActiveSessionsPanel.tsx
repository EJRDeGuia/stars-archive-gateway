import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Monitor, Smartphone, Globe, X } from 'lucide-react';

interface ActiveSession {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  location_data: any;
  created_at: string;
  last_activity: string;
  session_type: string;
  is_active: boolean;
}

interface ActiveSessionsPanelProps {
  sessions: ActiveSession[];
  loading: boolean;
  onTerminateSession: (sessionId: string) => void;
}

const getDeviceIcon = (userAgent: string) => {
  if (userAgent.toLowerCase().includes('mobile')) {
    return <Smartphone className="w-4 h-4" />;
  }
  return <Monitor className="w-4 h-4" />;
};

const getSessionTypeColor = (type: string) => {
  switch (type) {
    case 'admin':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'archivist':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'researcher':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return time.toLocaleDateString();
};

const ActiveSessionsPanel: React.FC<ActiveSessionsPanelProps> = ({
  sessions,
  loading,
  onTerminateSession
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Active Sessions
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Active Sessions
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            {sessions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2" />
              <p>No active sessions</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getDeviceIcon(session.user_agent)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          User: {session.user_id.substring(0, 8)}...
                        </span>
                        <Badge className={getSessionTypeColor(session.session_type)}>
                          {session.session_type}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Active
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          <span>IP: {session.ip_address}</span>
                          {session.location_data?.country && (
                            <span>• {session.location_data.country}</span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Started:</span> {formatTimeAgo(session.created_at)}
                        </div>
                        <div>
                          <span className="font-medium">Last Activity:</span> {formatTimeAgo(session.last_activity)}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-md">
                          <span className="font-medium">User Agent:</span> {session.user_agent}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTerminateSession(session.id)}
                    className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveSessionsPanel;