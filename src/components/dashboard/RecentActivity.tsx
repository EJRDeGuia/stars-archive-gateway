
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentActivity: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-dlsl-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-dlsl-green" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
          <p className="text-gray-600 mb-6">Start exploring to see your activity here</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/explore')} className="bg-dlsl-green hover:bg-dlsl-green/90">
              Start Exploring
            </Button>
            <Button variant="outline" onClick={() => navigate('/profile')}>
              <Users className="mr-2 h-4 w-4 text-dlsl-green" />
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
