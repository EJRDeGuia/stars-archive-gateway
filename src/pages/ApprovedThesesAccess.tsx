import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Clock, Eye, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ApprovedRequest {
  id: string;
  thesis_id: string;
  request_type: string;
  status: string;
  requested_at: string;
  reviewed_at: string;
  expires_at: string;
  theses: {
    id: string;
    title: string;
    author: string;
    colleges?: {
      name: string;
    };
  };
}

const ApprovedThesesAccess: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: approvedRequests = [], isLoading } = useQuery({
    queryKey: ['approved-thesis-access', user?.id],
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
        .eq('status', 'approved')
        .order('reviewed_at', { ascending: false });

      if (error) throw error;
      return data as ApprovedRequest[];
    },
    enabled: !!user?.id,
  });

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) <= new Date();
  };

  const activeRequests = approvedRequests.filter(req => !isExpired(req.expires_at));
  const expiredRequests = approvedRequests.filter(req => isExpired(req.expires_at));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Approved Thesis Access</h1>
            <p className="text-gray-600">
              View and access theses that have been approved for your research. Access is time-limited to 24 hours from approval.
            </p>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dlsl-green mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading approved theses...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Active Access */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Active Access ({activeRequests.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600">No active thesis access at the moment</p>
                      <Button
                        onClick={() => navigate('/explore')}
                        className="mt-4"
                      >
                        Browse Theses
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeRequests.map((request) => (
                        <div
                          key={request.id}
                          className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                {request.theses.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {request.theses.author} • {request.theses.colleges?.name || 'N/A'}
                              </p>
                            </div>
                            <Badge variant="default" className="bg-green-600">
                              Active
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>Approved {new Date(request.reviewed_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-orange-600" />
                              <span className="font-medium">{getTimeRemaining(request.expires_at)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span>Full Text Access</span>
                            </div>
                          </div>

                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              <div className="text-sm text-green-800">
                                <strong>Access Granted:</strong> You can view the complete thesis document for the next {getTimeRemaining(request.expires_at).toLowerCase()}.
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={() => navigate(`/thesis/${request.thesis_id}`)}
                            className="w-full"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Thesis
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Expired Access */}
              {expiredRequests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-gray-400" />
                      Expired Access ({expiredRequests.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {expiredRequests.map((request) => (
                        <div
                          key={request.id}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-700 mb-1">
                                {request.theses.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {request.theses.author} • {request.theses.colleges?.name || 'N/A'}
                              </p>
                            </div>
                            <Badge variant="secondary" className="bg-gray-200">
                              Expired
                            </Badge>
                          </div>

                          <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700">
                              <strong>Access Expired:</strong> This 24-hour access period ended on {new Date(request.expires_at).toLocaleString()}. 
                              You can request access again if needed.
                            </p>
                          </div>

                          <Button
                            onClick={() => navigate(`/request-access/${request.thesis_id}`)}
                            variant="outline"
                            className="w-full"
                          >
                            Request Access Again
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApprovedThesesAccess;
