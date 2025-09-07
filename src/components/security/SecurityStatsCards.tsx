import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Users, Shield, Activity } from 'lucide-react';

interface SecurityStats {
  totalAlerts: number;
  unresolvedAlerts: number;
  activeSessions: number;
  recentScans: number;
}

interface SecurityStatsCardsProps {
  stats: SecurityStats;
  loading: boolean;
}

const SecurityStatsCards: React.FC<SecurityStatsCardsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-12 animate-pulse mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Security Alerts",
      value: stats.totalAlerts,
      subtitle: `${stats.unresolvedAlerts} unresolved`,
      icon: AlertTriangle,
      color: stats.unresolvedAlerts > 0 ? "text-red-500" : "text-green-500"
    },
    {
      title: "Active Sessions",
      value: stats.activeSessions,
      subtitle: "Currently online",
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Recent Scans",
      value: stats.recentScans,
      subtitle: "Last 24 hours",
      icon: Shield,
      color: "text-purple-500"
    },
    {
      title: "System Status",
      value: "Secure",
      subtitle: "All systems operational",
      icon: Activity,
      color: "text-green-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <p className="text-xs text-gray-500 mt-1">
              {card.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SecurityStatsCards;