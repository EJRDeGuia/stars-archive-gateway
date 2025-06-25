
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Building, AlertTriangle, Loader2 } from "lucide-react";
import { useSystemStats } from "@/hooks/useSystemStats";

const AdminStatsGrid: React.FC = () => {
  const { data: systemStats, isLoading } = useSystemStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {systemStats?.active_users?.value || 0}
              </p>
              <p className="text-dlsl-green text-sm font-medium">Last 30 days</p>
            </div>
            <div className="w-12 h-12 bg-dlsl-green/10 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-dlsl-green" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Theses</p>
              <p className="text-3xl font-bold text-gray-900">
                {systemStats?.total_theses?.value || 0}
              </p>
              <p className="text-dlsl-green text-sm font-medium">
                +{systemStats?.monthly_uploads?.value || 0} this month
              </p>
            </div>
            <div className="w-12 h-12 bg-dlsl-green/10 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-dlsl-green" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Colleges</p>
              <p className="text-3xl font-bold text-gray-900">
                {systemStats?.total_colleges?.value || 0}
              </p>
              <p className="text-dlsl-green text-sm font-medium">Active programs</p>
            </div>
            <div className="w-12 h-12 bg-dlsl-green/10 rounded-2xl flex items-center justify-center">
              <Building className="w-6 h-6 text-dlsl-green" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Weekly Views</p>
              <p className="text-3xl font-bold text-gray-900">
                {systemStats?.weekly_views?.value || 0}
              </p>
              <p className="text-dlsl-green text-sm font-medium">Last 7 days</p>
            </div>
            <div className="w-12 h-12 bg-dlsl-green/10 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-dlsl-green" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatsGrid;
