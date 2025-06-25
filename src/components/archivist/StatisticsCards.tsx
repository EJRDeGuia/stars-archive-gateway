
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Archive, Clock, TrendingUp, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSystemStats } from '@/hooks/useSystemStats';

const StatisticsCards: React.FC = () => {
  const navigate = useNavigate();
  const { data: systemStats, isLoading } = useSystemStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Theses</p>
              <p className="text-3xl font-bold text-gray-900">
                {systemStats?.total_theses?.value || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-dlsl-green/10 rounded-lg flex items-center justify-center">
              <Archive className="h-6 w-6 text-dlsl-green" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Across all colleges</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-orange-600">
                {systemStats?.active_users?.value || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-dlsl-green/10 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-dlsl-green" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-blue-600">
                {systemStats?.monthly_uploads?.value || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-dlsl-green/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-dlsl-green" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">New submissions</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quick Upload</p>
              <Button 
                onClick={() => navigate('/upload')}
                className="mt-2 bg-dlsl-green hover:bg-dlsl-green/90"
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Thesis
              </Button>
            </div>
            <div className="w-12 h-12 bg-dlsl-green/10 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-dlsl-green" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
