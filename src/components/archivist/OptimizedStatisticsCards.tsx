import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Clock, TrendingUp, BookOpen, Eye } from 'lucide-react';
import { useOptimizedArchivistData } from '@/hooks/useOptimizedArchivistData';

// Memoized individual stat card for better performance
const StatCard = memo(({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  loading 
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: string;
  loading?: boolean;
}) => (
  <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all duration-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <Icon className="h-5 w-5 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900">
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
        ) : (
          value.toLocaleString()
        )}
      </div>
      {trend && !loading && (
        <p className="text-xs text-gray-500 mt-1">{trend}</p>
      )}
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

const OptimizedStatisticsCards = () => {
  const { stats, statsLoading } = useOptimizedArchivistData();

  const statisticsData = [
    {
      title: "Total Theses",
      value: stats.totalTheses,
      icon: FileText,
      trend: `${stats.approvedTheses} approved`
    },
    {
      title: "Pending Review",
      value: stats.pendingReview,
      icon: Clock,
      trend: "Awaiting approval"
    },
    {
      title: "This Month",
      value: stats.thisMonthUploads,
      icon: TrendingUp,
      trend: "New uploads"
    },
    {
      title: "Collections",
      value: stats.totalCollections,
      icon: BookOpen,
      trend: "Public collections"
    },
    {
      title: "Weekly Views",
      value: stats.totalViews7Days,
      icon: Eye,
      trend: "Last 7 days"
    }
  ];

  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statisticsData.map((stat, index) => (
          <StatCard
            key={`stat-${index}`}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            loading={statsLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(OptimizedStatisticsCards);