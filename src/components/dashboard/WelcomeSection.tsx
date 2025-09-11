
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WelcomeSectionProps {
  userName: string;
  userRole: string;
  getGreeting: () => string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName, userRole, getGreeting }) => {
  const navigate = useNavigate();
  const isAdmin = userRole === 'admin';
  const isArchivist = userRole === 'archivist';

  return (
    <div className="relative mb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dlsl-green/5 via-emerald-50 to-teal-50 rounded-3xl transform -rotate-1 scale-105"></div>
      
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 shadow-lg">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-dlsl-green to-emerald-600 bg-clip-text text-transparent mb-4">
            {getGreeting()}, {userName}!
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light">
            Welcome back to <span className="font-semibold text-dlsl-green">STARS</span>. What would you like to explore today?
          </p>
          
          {(isAdmin || isArchivist) && (
            <div className="flex flex-wrap gap-4 animate-slide-in-right">
              {isAdmin && (
                <Button 
                  onClick={() => navigate('/admin')}
                  className="bg-gradient-to-r from-dlsl-green to-emerald-600 hover:from-emerald-600 hover:to-dlsl-green text-white shadow-lg hover:shadow-xl hover-scale transition-all duration-300"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Button>
              )}
              {isArchivist && (
                <Button 
                  onClick={() => navigate('/archivist')}
                  className="bg-gradient-to-r from-teal-500 to-dlsl-green hover:from-dlsl-green hover:to-teal-500 text-white shadow-lg hover:shadow-xl hover-scale transition-all duration-300"
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Archivist Dashboard
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-dlsl-green/20 to-emerald-300/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-teal-300/20 to-dlsl-green/20 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default WelcomeSection;
