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
import { Eye, Mail, Check, X, Clock, FileText, Users, Filter, Download, CheckSquare, BookOpen } from 'lucide-react';
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

interface RequesterGroup {
  requester_email: string;
  requester_name: string;
  institution: string;
  purpose: string;
  created_at: string;
  requests: AccessRequest[];
}

const AccessRequestsManager = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<RequesterGroup | null>(null);
  const [notes, setNotes] = useState('');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | ''>('');
  const [bulkNotes, setBulkNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewMode, setViewMode] = useState<'individual' | 'grouped'>('grouped');

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['access-requests'],
    queryFn: async () => {
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

  // Group requests by requester and date
  const groupedRequests = React.useMemo(() => {
    const groups: RequesterGroup[] = [];
    const processedEmails = new Set<string>();

    requests.forEach(request => {
      const key = `${request.requester_email}-${new Date(request.created_at).toDateString()}`;
      
      if (!processedEmails.has(key)) {
        const relatedRequests = requests.filter(r => 
          r.requester_email === request.requester_email &&
          new Date(r.created_at).toDateString() === new Date(request.created_at).toDateString()
        );

        if (relatedRequests.length > 1) {
          groups.push({
            requester_email: request.requester_email,
            requester_name: request.requester_name,
            institution: request.institution,
            purpose: request.purpose,
            created_at: request.created_at,
            requests: relatedRequests
          });
        }

        processedEmails.add(key);
      }
    });

    return groups;
  }, [requests]);

  // Individual requests (not part of groups)
  const individualRequests = React.useMemo(() => {
    const groupedRequestIds = new Set(
      groupedRequests.flatMap(group => group.requests.map(r => r.id))
    );
    return requests.filter(request => !groupedRequestIds.has(request.id));
  }, [requests, groupedRequests]);

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

  const handleGroupAction = (group: RequesterGroup, action: 'approve' | 'reject') => {
    const requestIds = group.requests.map(r => r.id);
    bulkUpdateMutation.mutate({
      ids: requestIds,
      status: action,
      notes: notes || undefined
    });
  };

  const filteredRequests = requests.filter(request => 
    filterStatus === 'all' || request.status === filterStatus
  );

  const filteredGroups = groupedRequests.filter(group =>
    filterStatus === 'all' || group.requests.some(r => r.status === filterStatus)
  );

  const filteredIndividualRequests = individualRequests.filter(request =>
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
    // sendThesisMutation.mutate({
    //   requestId: request.id,
    //   thesisId: request.thesis_id,
    //   email: request.requester_email
    // });
    toast.info('This feature is coming soon!');
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
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grouped' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grouped')}
                className="rounded-r-none"
              >
                <BookOpen className="h-4 w-4 mr-1" />
                Grouped
              </Button>
              <Button
                variant={viewMode === 'individual' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('individual')}
                className="rounded-l-none"
              >
                <FileText className="h-4 w-4 mr-1" />
                Individual
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Export feature coming soon!')}
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

        {/* Multi-thesis Alert */}
        {groupedRequests.length > 0 && (
          <Alert className="bg-orange-50 border-orange-200">
            <BookOpen className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>{groupedRequests.length} multi-thesis requests</strong> found where requesters are asking for multiple theses at once.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No access requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
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

            {viewMode === 'grouped' && (
              <div className="space-y-4">
                {/* Multi-thesis Groups */}
                {filteredGroups.map((group, index) => (
                  <Card key={`group-${index}`} className="border-l-4 border-l-orange-400">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-orange-600" />
                            Multi-Thesis Request ({group.requests.length} theses)
                          </CardTitle>
                          <p className="text-sm text-gray-600">{group.requester_name} • {group.requester_email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedGroup(group);
                                  setNotes('');
                                }}
                              >
                                Review All
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Review Multi-Thesis Request</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Requester Information</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <p><strong>Name:</strong> {group.requester_name}</p>
                                    <p><strong>Email:</strong> {group.requester_email}</p>
                                    <p><strong>Institution:</strong> {group.institution || 'Not specified'}</p>
                                    <p><strong>Date:</strong> {new Date(group.created_at).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Purpose</h4>
                                  <p className="text-sm text-gray-600">{group.purpose}</p>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Requested Theses ({group.requests.length})</h4>
                                  <div className="border rounded-lg">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Title</TableHead>
                                          <TableHead>Author</TableHead>
                                          <TableHead>Status</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {group.requests.map((request) => (
                                          <TableRow key={request.id}>
                                            <TableCell className="font-medium">
                                              {request.thesis?.title || 'Unknown Thesis'}
                                            </TableCell>
                                            <TableCell>{request.thesis?.author || 'Unknown Author'}</TableCell>
                                            <TableCell>
                                              <Badge variant={
                                                request.status === 'approved' ? 'default' :
                                                request.status === 'rejected' ? 'destructive' : 'secondary'
                                              }>
                                                {request.status}
                                              </Badge>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Notes for all requests (optional)
                                  </label>
                                  <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add notes that will apply to all theses in this request..."
                                    rows={3}
                                  />
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleGroupAction(group, 'approve')}
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={updateRequestMutation.isPending}
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve All ({group.requests.length})
                                  </Button>
                                  <Button
                                    onClick={() => handleGroupAction(group, 'reject')}
                                    variant="destructive"
                                    disabled={updateRequestMutation.isPending}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Reject All ({group.requests.length})
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Purpose:</strong> {group.purpose}</p>
                        <div>
                          <p className="text-sm font-medium mb-1">Requested Theses:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {group.requests.map((request) => (
                              <div key={request.id} className="text-sm p-2 bg-gray-50 rounded flex items-center justify-between">
                                <div>
                                  <p className="font-medium line-clamp-1">{request.thesis?.title || 'Unknown'}</p>
                                  <p className="text-gray-600">by {request.thesis?.author || 'Unknown'}</p>
                                </div>
                                <Badge variant={
                                  request.status === 'approved' ? 'default' :
                                  request.status === 'rejected' ? 'destructive' : 'secondary'
                                }>
                                  {request.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Individual Requests */}
                {filteredIndividualRequests.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Individual Requests ({filteredIndividualRequests.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg overflow-hidden">
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
                            {filteredIndividualRequests.map((request) => (
                              <TableRow key={request.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{request.requester_name}</div>
                                    <div className="text-sm text-gray-500">{request.requester_email}</div>
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
                                <TableCell>
                                  <Badge variant={
                                    request.status === 'approved' ? 'default' :
                                    request.status === 'rejected' ? 'destructive' : 'secondary'
                                  }>
                                    {request.status}
                                  </Badge>
                                </TableCell>
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
                                                onClick={() => updateRequestMutation.mutate({ id: request.id, status: 'approved', notes })}
                                                className="bg-green-600 hover:bg-green-700"
                                                disabled={updateRequestMutation.isPending}
                                              >
                                                <Check className="h-4 w-4 mr-2" />
                                                Approve
                                              </Button>
                                              <Button
                                                onClick={() => updateRequestMutation.mutate({ id: request.id, status: 'rejected', notes })}
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
                                        disabled={updateRequestMutation.isPending}
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
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {viewMode === 'individual' && (
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
                                disabled={updateRequestMutation.isPending}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccessRequestsManager;
