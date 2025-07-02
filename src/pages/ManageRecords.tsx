
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Eye, Edit3, Trash2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheses } from '@/hooks/useApi';
import { ThesisManagementService } from '@/services/thesisManagement';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const ManageRecords = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch all theses (including non-approved ones) for management
  const { data: thesesResult, isLoading, error, refetch } = useTheses({ 
    includeAll: true,
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter as any : undefined
  });

  // Fix: properly handle the data structure returned from useTheses
  const theses = Array.isArray(thesesResult) ? thesesResult : (thesesResult?.data || []);

  console.log('[ManageRecords] Theses data:', { thesesResult, theses, isLoading, error });

  const filteredTheses = theses.filter((thesis: any) => {
    const matchesSearch = !searchTerm || 
      thesis.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thesis.author?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || thesis.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (thesisId: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    if (user.role !== 'admin') {
      toast.error('Only administrators can delete theses');
      return;
    }

    if (window.confirm('Are you sure you want to delete this thesis?')) {
      setActionLoading(thesisId);
      try {
        const result = await ThesisManagementService.bulkDelete([thesisId], user.id);
        if (result.success) {
          toast.success('Thesis deleted successfully');
          queryClient.invalidateQueries({ queryKey: ['theses'] });
          refetch();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Failed to delete thesis');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleApprove = async (thesisId: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    if (user.role !== 'admin') {
      toast.error('Only administrators can approve theses');
      return;
    }

    setActionLoading(thesisId);
    try {
      const result = await ThesisManagementService.approveThesis(thesisId, user.id);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['theses'] });
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
        refetch();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to approve thesis');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (thesisId: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    if (user.role !== 'admin') {
      toast.error('Only administrators can reject theses');
      return;
    }

    setActionLoading(thesisId);
    try {
      const result = await ThesisManagementService.rejectThesis(thesisId, user.id);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['theses'] });
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
        refetch();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to reject thesis');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: { label: 'Pending Review', variant: 'secondary' as const },
      approved: { label: 'Approved', variant: 'default' as const },
      needs_revision: { label: 'Needs Revision', variant: 'destructive' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_review;
  };

  // Check if user has permission
  if (!user || !['archivist', 'admin'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
              <p className="text-xl text-gray-600 mb-8">You don't have permission to access this page.</p>
              <Button onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Button 
              onClick={() => navigate(-1)} 
              variant="ghost" 
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Records</h1>
                <p className="text-xl text-gray-600">
                  {isAdmin ? 'Review, approve, and organize thesis submissions' : 'View and organize thesis submissions'}
                </p>
              </div>
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by title or author..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="needs_revision">Needs Revision</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="text-center text-red-600">
                  <p>Error loading theses: {error.message}</p>
                  <Button onClick={() => refetch()} className="mt-2">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>
                Thesis Records ({filteredTheses.length})
                {!isAdmin && (
                  <div className="text-sm font-normal text-gray-600 mt-1">
                    Note: Only administrators can approve/reject theses
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dlsl-green mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading theses...</p>
                </div>
              ) : filteredTheses.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  {theses.length === 0 
                    ? "No theses found. Upload some theses to get started."
                    : "No theses found matching your criteria."
                  }
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTheses.map((thesis: any) => (
                    <div
                      key={thesis.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{thesis.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          by {thesis.author} • {thesis.colleges?.name || 'Unknown College'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Uploaded: {thesis.created_at ? new Date(thesis.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusBadge(thesis.status).variant}>
                          {getStatusBadge(thesis.status).label}
                        </Badge>
                        
                        {isAdmin && thesis.status === 'pending_review' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => handleApprove(thesis.id)}
                              disabled={actionLoading === thesis.id}
                            >
                              {actionLoading === thesis.id ? 'Processing...' : 'Approve'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleReject(thesis.id)}
                              disabled={actionLoading === thesis.id}
                            >
                              {actionLoading === thesis.id ? 'Processing...' : 'Reject'}
                            </Button>
                          </div>
                        )}
                        
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/thesis/${thesis.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/thesis/${thesis.id}/edit`)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(thesis.id)}
                              disabled={actionLoading === thesis.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManageRecords;
