import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Clock, CheckCircle, XCircle, FileText, Calendar } from 'lucide-react';

interface ThesisRequest {
  id: string;
  thesis_id: string;
  user_id: string;
  request_type: string;
  status: string;
  requested_at: string;
  reviewed_at?: string;
  expires_at?: string;
  theses: {
    title: string;
    author: string;
    colleges?: {
      name: string;
    };
  };
}

const ThesisRequestsTracker: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['thesis-requests-tracker', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('lrc_approval_requests')
        .select(`
          *,
          theses!inner(
            title,
            author,
            colleges(name)
          )
        `)
        .order('requested_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ThesisRequest[];
    },
  });

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      approved: { label: 'Approved', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      rejected: { label: 'Rejected', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' }
    };
    const statusConfig = config[status as keyof typeof config] || config.pending;
    const Icon = statusConfig.icon;
    
    return (
      <Badge variant={statusConfig.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusConfig.label}
      </Badge>
    );
  };

  const getTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return 'N/A';
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-dlsl-green" />
            Thesis Access Requests Tracker
          </CardTitle>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{requests.length}</div>
            <div className="text-sm text-blue-600">Total Requests</div>
          </div>
          <div 
            className="bg-yellow-50 p-3 rounded-lg cursor-pointer hover:bg-yellow-100"
            onClick={() => setStatusFilter('pending')}
          >
            <div className="text-2xl font-bold text-yellow-700">{pendingCount}</div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div 
            className="bg-green-50 p-3 rounded-lg cursor-pointer hover:bg-green-100"
            onClick={() => setStatusFilter('approved')}
          >
            <div className="text-2xl font-bold text-green-700">{approvedCount}</div>
            <div className="text-sm text-green-600">Approved</div>
          </div>
          <div 
            className="bg-red-50 p-3 rounded-lg cursor-pointer hover:bg-red-100"
            onClick={() => setStatusFilter('rejected')}
          >
            <div className="text-2xl font-bold text-red-700">{rejectedCount}</div>
            <div className="text-sm text-red-600">Rejected</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dlsl-green mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No {statusFilter !== 'all' ? statusFilter : ''} thesis access requests found.</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex items-center gap-2 mb-4">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>

            {/* Requests Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thesis</TableHead>
                    <TableHead>Request Type</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.theses.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {request.theses.author} • {request.theses.colleges?.name || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {request.request_type === 'full_text_access' ? 'Full Text' : 'Download'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {new Date(request.requested_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        {request.status === 'approved' && request.expires_at ? (
                          <div className="text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-orange-600" />
                              <span className={getTimeRemaining(request.expires_at) === 'Expired' ? 'text-red-600 font-medium' : 'text-gray-700'}>
                                {getTimeRemaining(request.expires_at)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ThesisRequestsTracker;
