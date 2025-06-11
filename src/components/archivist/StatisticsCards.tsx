
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Archive, Clock, TrendingUp, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface StatisticsCardsProps {
  stats: {
    totalTheses: number;
    pendingReview: number;
    thisMonth: number;
  };
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Theses</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTheses}</p>
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
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingReview}</p>
            </div>
            <div className="w-12 h-12 bg-dlsl-green/10 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-dlsl-green" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Awaiting processing</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-blue-600">{stats.thisMonth}</p>
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
