
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DebugUserInfo: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Only show in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (!isDevelopment) return null;

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-yellow-800">Debug: Current User Info</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <p className="text-sm text-yellow-700">Loading user...</p>
        ) : user ? (
          <div className="space-y-1 text-sm">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> <Badge variant="secondary">{user.role}</Badge></p>
          </div>
        ) : (
          <p className="text-sm text-yellow-700">No user logged in</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DebugUserInfo;
