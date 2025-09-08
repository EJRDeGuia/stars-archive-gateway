import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Database, Server, Wifi } from 'lucide-react';

interface SystemHealthProps {
  loading?: boolean;
}

const SystemHealthMonitor: React.FC<SystemHealthProps> = ({ loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const healthMetrics = [
    {
      name: 'Authentication',
      status: 'healthy',
      icon: Shield,
      uptime: '99.9%'
    },
    {
      name: 'Database',
      status: 'healthy',
      icon: Database,
      uptime: '99.8%'
    },
    {
      name: 'File Storage',
      status: 'healthy',
      icon: Server,
      uptime: '99.9%'
    },
    {
      name: 'Edge Functions',
      status: 'healthy',
      icon: Wifi,
      uptime: '99.7%'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          System Health
          <Badge className="bg-green-100 text-green-800 border-green-200">
            All Systems Operational
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {healthMetrics.map((metric) => (
            <div key={metric.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <metric.icon className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">{metric.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{metric.uptime}</span>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthMonitor;