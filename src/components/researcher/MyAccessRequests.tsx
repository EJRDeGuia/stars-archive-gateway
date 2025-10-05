import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Check, X, FileText, Calendar, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AccessRequest {
  id: string;
  thesis_id: string;
  request_type: 'full_text_access' | 'download_access';
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewer_notes?: string;
  requested_at: string;
  reviewed_at?: string;
  expires_at?: string;
  theses: {
    id: string;
    title: string;
    author: string;
    colleges?: {
      name: string;
    };
  };
}

const MyAccessRequests: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: ['my-access-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('lrc_approval_requests')
        .select(`
          *,
          theses!inner(
            id,
            title,
            author,
            colleges(name)
          )
        `)
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }

      return data as AccessRequest[];
    },
    enabled: !!user?.id,
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Under Review', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      approved: { label: 'Approved', variant: 'default' as const, icon: Check, color: 'text-green-600' },
      rejected: { label: 'Denied', variant: 'destructive' as const, icon: X, color: 'text-red-600' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getRequestTypeLabel = (type: string) => {
    return type === 'full_text_access' ? 'Full Text Access' : 'Download Access';
  };

  const handleViewThesis = (thesisId: string) => {
    navigate(`/thesis/${thesisId}`);
  };

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <X className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Failed to load your access requests. Please try again.</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dlsl-green mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading your access requests...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-dlsl-green" />
          My Access Requests ({requests.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">No access requests yet</p>
            <p className="text-sm">Request access to theses you need for your research</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div 
                key={request.id}
                className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 
                      className="font-semibold text-gray-900 mb-1 hover:text-dlsl-green cursor-pointer"
                      onClick={() => handleViewThesis(request.thesis_id)}
                    >
                      {request.theses.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {request.theses.author} • {request.theses.colleges?.name || 'N/A'}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{getRequestTypeLabel(request.request_type)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Requested {new Date(request.requested_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {request.status === 'approved' && request.expires_at && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-green-800">
                      <strong>Access granted until:</strong> {new Date(request.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {request.status === 'rejected' && request.reviewer_notes && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-red-800">
                      <strong>Reason:</strong> {request.reviewer_notes}
                    </p>
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-yellow-800">
                      Your request is being reviewed by LRC staff. You will be notified via email when a decision is made.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewThesis(request.thesis_id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Thesis
                  </Button>
                  {request.status === 'approved' && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Access Active
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyAccessRequests;
