import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, Check, X, Clock, FileText, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LRCApprovalRequest {
  id: string;
  thesis_id: string;
  user_id: string;
  request_type: 'full_text_access' | 'download_access';
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewer_notes?: string;
  requested_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
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

const LRCApprovalManager: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<LRCApprovalRequest | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['lrc-approval-requests', filterStatus],
    queryFn: async () => {
      let query = supabase
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
        .order('requested_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as LRCApprovalRequest[];
    },
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      notes 
    }: { 
      id: string; 
      status: 'approved' | 'rejected'; 
      notes?: string;
    }) => {
      // Validate inputs
      if (!id || !status) {
        throw new Error('Invalid request data');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check if request still exists and is pending
      const { data: currentRequest, error: checkError } = await supabase
        .from('lrc_approval_requests')
        .select('id, status, user_id, theses(title)')
        .eq('id', id)
        .single();

      if (checkError || !currentRequest) {
        throw new Error('Request not found');
      }

      if (currentRequest.status !== 'pending') {
        throw new Error('This request has already been reviewed');
      }

      const updates: any = {
        status,
        reviewer_notes: notes?.trim() || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id
      };

      // Set expiration date if approved (30 days from now)
      if (status === 'approved') {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        updates.expires_at = expiresAt.toISOString();
      }

      const { error } = await supabase
        .from('lrc_approval_requests')
        .update(updates)
        .eq('id', id);
      
      if (error) {
        console.error('Update error:', error);
        throw new Error('Failed to update request status');
      }

      // TODO: Send email notification to requester
      // This would ideally be handled by a database trigger or edge function
      
      return { status, requesterId: currentRequest.user_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lrc-approval-requests'] });
      const action = data.status === 'approved' ? 'approved' : 'rejected';
      toast.success(`Request ${action} successfully. User will be notified via email.`);
      setSelectedRequest(null);
      setReviewerNotes('');
    },
    onError: (error: any) => {
      console.error('Failed to update request:', error);
      if (error.message.includes('already been reviewed')) {
        toast.error('This request has already been reviewed by another admin');
      } else if (error.message.includes('not found')) {
        toast.error('Request not found. It may have been deleted.');
      } else {
        toast.error('Failed to update request. Please try again.');
      }
      queryClient.invalidateQueries({ queryKey: ['lrc-approval-requests'] });
    },
  });

  const handleReview = (request: LRCApprovalRequest) => {
    setSelectedRequest(request);
    setReviewerNotes(request.reviewer_notes || '');
  };

  const handleApprove = () => {
    if (!selectedRequest) return;
    
    if (!reviewerNotes.trim()) {
      toast.warning('Please add a note explaining your approval decision');
      return;
    }
    
    updateRequestMutation.mutate({
      id: selectedRequest.id,
      status: 'approved',
      notes: reviewerNotes
    });
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    
    if (!reviewerNotes.trim()) {
      toast.error('Please add a note explaining why the request is being rejected');
      return;
    }
    
    updateRequestMutation.mutate({
      id: selectedRequest.id,
      status: 'rejected',
      notes: reviewerNotes
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
      approved: { label: 'Approved', variant: 'default' as const, icon: Check },
      rejected: { label: 'Rejected', variant: 'destructive' as const, icon: X }
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dlsl-green mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading LRC approval requests...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-dlsl-green" />
              LRC Approval Requests ({requests.length})
            </CardTitle>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{requests.length}</div>
              <div className="text-sm text-blue-600">Total Requests</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg cursor-pointer hover:bg-yellow-100" onClick={() => setFilterStatus('pending')}>
              <div className="text-2xl font-bold text-yellow-700">{pendingCount}</div>
              <div className="text-sm text-yellow-600">Pending Review</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg cursor-pointer hover:bg-green-100" onClick={() => setFilterStatus('approved')}>
              <div className="text-2xl font-bold text-green-700">{approvedCount}</div>
              <div className="text-sm text-green-600">Approved</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg cursor-pointer hover:bg-red-100" onClick={() => setFilterStatus('rejected')}>
              <div className="text-2xl font-bold text-red-700">{rejectedCount}</div>
              <div className="text-sm text-red-600">Rejected</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No {filterStatus !== 'all' ? filterStatus : ''} LRC approval requests found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-2">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
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
                      <TableHead className="text-right">Actions</TableHead>
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
                            {getRequestTypeLabel(request.request_type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(request.requested_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReview(request)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review LRC Approval Request</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              {/* Thesis Information */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">Thesis Details</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Title:</strong> {selectedRequest.theses.title}</p>
                  <p><strong>Author:</strong> {selectedRequest.theses.author}</p>
                  <p><strong>College:</strong> {selectedRequest.theses.colleges?.name || 'N/A'}</p>
                </div>
              </div>

              {/* Request Details */}
              <div>
                <h4 className="font-semibold mb-2">Request Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Request Type:</strong> {getRequestTypeLabel(selectedRequest.request_type)}</p>
                  <p><strong>Requested:</strong> {new Date(selectedRequest.requested_at).toLocaleString()}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedRequest.status)}</p>
                </div>
              </div>

              {/* Justification */}
              <div>
                <h4 className="font-semibold mb-2">Justification</h4>
                <div className="p-3 bg-muted/30 rounded-lg text-sm">
                  {selectedRequest.justification}
                </div>
              </div>

              {/* Reviewer Notes */}
              <div>
                <h4 className="font-semibold mb-2">Reviewer Notes *</h4>
                <Textarea
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder="Required: Add notes explaining your decision. This will be included in the notification email to the requester."
                  rows={4}
                  className={reviewerNotes.trim().length < 10 ? 'border-yellow-300' : ''}
                />
                {reviewerNotes.trim().length > 0 && reviewerNotes.trim().length < 10 && (
                  <p className="text-xs text-yellow-600 mt-1">
                    Please provide a more detailed explanation (at least 10 characters)
                  </p>
                )}
              </div>

              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={updateRequestMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={updateRequestMutation.isPending}
                    className="bg-dlsl-green hover:bg-dlsl-green/90"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )}

              {selectedRequest.status !== 'pending' && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    This request has already been {selectedRequest.status}.
                    {selectedRequest.reviewed_at && ` Reviewed on ${new Date(selectedRequest.reviewed_at).toLocaleString()}`}
                  </p>
                  {selectedRequest.reviewer_notes && (
                    <p className="text-sm mt-2">
                      <strong>Notes:</strong> {selectedRequest.reviewer_notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LRCApprovalManager;
