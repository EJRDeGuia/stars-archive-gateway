
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
    <div className="mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        {getGreeting()}, {userName}!
      </h1>
      <p className="text-xl text-gray-600">
        Welcome back to STARS. What would you like to explore today?
      </p>
      {isAdmin && (
        <div className="mt-4">
          <Button 
            onClick={() => navigate('/admin')}
            className="bg-dlsl-green hover:bg-dlsl-green/90 text-white"
          >
            <Shield className="mr-2 h-4 w-4" />
            Go to Admin Dashboard
          </Button>
        </div>
      )}
      {isArchivist && (
        <div className="mt-4">
          <Button 
            onClick={() => navigate('/archivist')}
            className="bg-dlsl-green hover:bg-dlsl-green/90 text-white"
          >
            <Archive className="mr-2 h-4 w-4" />
            Go to Archivist Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default WelcomeSection;
