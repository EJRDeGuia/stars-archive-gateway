
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'researcher' | 'archivist' | 'admin' | 'guest_researcher';
  exactRole?: boolean; // New prop for exact role matching
}

const ProtectedRoute = ({ children, requiredRole, exactRole = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dlsl-green"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole) {
    if (exactRole) {
      // Exact role matching - user must have the exact required role
      if (user.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
      }
    } else {
      // Hierarchical role checking (default behavior)
      const roleHierarchy = { 
        guest_researcher: 1, 
        researcher: 2, 
        archivist: 3, 
        admin: 4 
      };
      
      const userLevel = roleHierarchy[user.role] || 1;
      const requiredLevel = roleHierarchy[requiredRole] || 1;
      
      if (userLevel < requiredLevel) {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
