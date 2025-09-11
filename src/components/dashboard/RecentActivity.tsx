
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentActivity: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
      <div className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-gray-100 p-8 hover-scale transition-all duration-300">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-dlsl-green/5 to-emerald-50 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-teal-50 to-dlsl-green/5 rounded-full blur-lg"></div>
        
        <div className="relative text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-dlsl-green/10 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Clock className="h-10 w-10 text-dlsl-green animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No recent activity</h3>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed">
            Start exploring our vast collection of research to see your activity timeline here
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => navigate('/explore')} 
              className="bg-gradient-to-r from-dlsl-green to-emerald-600 hover:from-emerald-600 hover:to-dlsl-green text-white shadow-lg hover:shadow-xl hover-scale transition-all duration-300"
            >
              Start Exploring
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/profile')}
              className="border-dlsl-green text-dlsl-green hover:bg-dlsl-green hover:text-white transition-all duration-300"
            >
              <Users className="mr-2 h-4 w-4" />
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
