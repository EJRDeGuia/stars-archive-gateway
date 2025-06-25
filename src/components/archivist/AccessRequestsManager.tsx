
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, Mail, Check, X, Clock, FileText, Users, Filter, Download, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccessRequest {
  id: string;
  thesis_id: string;
  user_id: string;
  requester_name: string;
  requester_email: string;
  institution: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
  created_at: string;
  thesis?: {
    id: string;
    title: string;
    author: string;
    college_name?: string;
  };
}

const AccessRequestsManager = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [notes, setNotes] = useState('');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | ''>('');
  const [bulkNotes, setBulkNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['access-requests'],
    queryFn: async () => {
      // First get the access requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('thesis_access_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (requestsError) throw requestsError;
      if (!requestsData) return [];

      const requestsWithTheses = await Promise.all(
        requestsData.map(async (request) => {
          const { data: thesisData, error: thesisError } = await supabase
            .from('theses')
            .select(`
              id,
              title,
              author,
              colleges (
                name
              )
            `)
            .eq('id', request.thesis_id)
            .single();

          return {
            ...request,
            status: request.status as 'pending' | 'approved' | 'rejected',
            thesis: thesisError ? undefined : {
              id: thesisData.id,
              title: thesisData.title,
              author: thesisData.author,
              college_name: thesisData.colleges?.name
            }
          } as AccessRequest;
        })
      );

      return requestsWithTheses;
    },
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { error } = await supabase
        .from('thesis_access_requests')
        .update({
          status,
          notes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access-requests'] });
      toast.success('Request updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update request');
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, status, notes }: { ids: string[]; status: string; notes?: string }) => {
      const { error } = await supabase
        .from('thesis_access_requests')
        .update({
          status,
          notes,
          reviewed_at: new Date().toISOString()
        })
        .in('id', ids);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['access-requests'] });
      toast.success(`${variables.ids.length} request(s) updated successfully`);
      setSelectedRequests([]);
      setBulkAction('');
      setBulkNotes('');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update requests');
    },
  });

  const sendThesisMutation = useMutation({
    mutationFn: async ({ requestId, thesisId, email }: { requestId: string; thesisId: string; email: string }) => {
      await updateRequestMutation.mutateAsync({ id: requestId, status: 'approved' });
      toast.success(`Thesis sent to ${email}`);
    },
  });

  const filteredRequests = requests.filter(request => 
    filterStatus === 'all' || request.status === filterStatus
  );

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(filteredRequests.map(r => r.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleSelectRequest = (requestId: string, checked: boolean) => {
    if (checked) {
      setSelectedRequests([...selectedRequests, requestId]);
    } else {
      setSelectedRequests(selectedRequests.filter(id => id !== requestId));
    }
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedRequests.length === 0) return;
    
    bulkUpdateMutation.mutate({
      ids: selectedRequests,
      status: bulkAction,
      notes: bulkNotes || undefined
    });
  };

  const handleApprove = (request: AccessRequest) => {
    updateRequestMutation.mutate({
      id: request.id,
      status: 'approved',
      notes
    });
  };

  const handleReject = (request: AccessRequest) => {
    updateRequestMutation.mutate({
      id: request.id,
      status: 'rejected',
      notes
    });
  };

  const handleSendThesis = (request: AccessRequest) => {
    sendThesisMutation.mutate({
      requestId: request.id,
      thesisId: request.thesis_id,
      email: request.requester_email
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dlsl-green mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading access requests...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-dlsl-green" />
            Thesis Access Requests ({requests.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Export functionality could be implemented here
                toast.info('Export feature coming soon!');
              }}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{requests.length}</div>
            <div className="text-sm text-blue-600">Total Requests</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700">{pendingCount}</div>
            <div className="text-sm text-yellow-600">Pending Review</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{approvedCount}</div>
            <div className="text-sm text-green-600">Approved</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-700">{rejectedCount}</div>
            <div className="text-sm text-red-600">Rejected</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No access requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Filters and Bulk Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Filter:</span>
                <div className="flex gap-1">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                    >
                      {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedRequests.length > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{selectedRequests.length} selected</span>
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value as 'approve' | 'reject' | '')}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="">Bulk Action</option>
                    <option value="approve">Approve All</option>
                    <option value="reject">Reject All</option>
                  </select>
                  {bulkAction && (
                    <Button
                      size="sm"
                      onClick={handleBulkAction}
                      disabled={bulkUpdateMutation.isPending}
                      className="bg-dlsl-green hover:bg-dlsl-green/90"
                    >
                      <CheckSquare className="h-4 w-4 mr-1" />
                      Apply
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Bulk Notes Input */}
            {selectedRequests.length > 0 && bulkAction && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Notes for bulk {bulkAction} (optional):
                    </label>
                    <Textarea
                      value={bulkNotes}
                      onChange={(e) => setBulkNotes(e.target.value)}
                      placeholder="Add notes for all selected requests..."
                      rows={2}
                    />
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Requests Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Thesis</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRequests.includes(request.id)}
                          onCheckedChange={(checked) => handleSelectRequest(request.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.requester_name}</div>
                          <div className="text-sm text-gray-500">{request.requester_email}</div>
                          {request.institution && (
                            <div className="text-xs text-gray-400">{request.institution}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{request.thesis?.title || 'Unknown Thesis'}</div>
                          <div className="text-xs text-gray-500">by {request.thesis?.author || 'Unknown Author'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-600 line-clamp-2">{request.purpose}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/thesis/${request.thesis_id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {request.status === 'pending' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setNotes('');
                                  }}
                                >
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Review Access Request</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Request Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <p><strong>Requester:</strong> {request.requester_name}</p>
                                      <p><strong>Email:</strong> {request.requester_email}</p>
                                      <p><strong>Institution:</strong> {request.institution || 'Not specified'}</p>
                                      <p><strong>Purpose:</strong> {request.purpose}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Notes (optional)
                                    </label>
                                    <Textarea
                                      value={notes}
                                      onChange={(e) => setNotes(e.target.value)}
                                      placeholder="Add any notes about this decision..."
                                      rows={3}
                                    />
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleApprove(request)}
                                      className="bg-green-600 hover:bg-green-700"
                                      disabled={updateRequestMutation.isPending}
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => handleReject(request)}
                                      variant="destructive"
                                      disabled={updateRequestMutation.isPending}
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          
                          {request.status === 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => handleSendThesis(request)}
                              className="bg-blue-600 hover:bg-blue-700"
                              disabled={sendThesisMutation.isPending}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Send
                            </Button>
                          )}
                        </div>
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
  );
};

export default AccessRequestsManager;
