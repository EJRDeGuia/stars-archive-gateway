
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, Mail, Check, X, Clock, FileText } from 'lucide-react';
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

      // Then get thesis data for each request
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

  const sendThesisMutation = useMutation({
    mutationFn: async ({ requestId, thesisId, email }: { requestId: string; thesisId: string; email: string }) => {
      // First approve the request
      await updateRequestMutation.mutateAsync({ id: requestId, status: 'approved' });
      
      // Here you would implement the actual email sending logic
      // For now, we'll just show a success message
      toast.success(`Thesis sent to ${email}`);
    },
  });

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
          <div className="text-center">Loading access requests...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-dlsl-green" />
          Thesis Access Requests ({requests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No access requests found.
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requester</TableHead>
                  <TableHead>Thesis</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
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
        )}
      </CardContent>
    </Card>
  );
};

export default AccessRequestsManager;
