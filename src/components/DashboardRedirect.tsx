import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardPath } from '@/utils/dashboardUtils';

/**
 * Component that redirects users to their role-specific dashboard
 * This replaces the generic Dashboard page
 */
const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();

  // If no user is authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to role-specific dashboard
  const dashboardPath = getDashboardPath(user.role);
  return <Navigate to={dashboardPath} replace />;
};

export default DashboardRedirect;