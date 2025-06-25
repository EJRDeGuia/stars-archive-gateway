
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FileText, Lock } from 'lucide-react';

interface RequestAccessButtonProps {
  thesisId: string;
  className?: string;
}

const RequestAccessButton: React.FC<RequestAccessButtonProps> = ({ thesisId, className = '' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRequestAccess = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    navigate(`/request-access/${thesisId}`);
  };

  return (
    <Button 
      onClick={handleRequestAccess}
      variant="outline"
      className={`border-dlsl-green text-dlsl-green hover:bg-dlsl-green hover:text-white ${className}`}
    >
      <Lock className="w-4 h-4 mr-2" />
      Request Full Access
    </Button>
  );
};

export default RequestAccessButton;
