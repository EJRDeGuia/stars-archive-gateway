
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Eye, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThesisManagementService } from "@/services/thesisManagement";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { logger } from "@/services/logger";
import ThesisReviewDialog from "./ThesisReviewDialog";

interface AdminRecentThesesProps {
  theses: any[];
  thesesLoading: boolean;
  colleges: any[];
}

const AdminRecentTheses: React.FC<AdminRecentThesesProps> = ({
  theses,
  thesesLoading,
  colleges
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedThesis, setSelectedThesis] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const handleApprove = async (thesisId: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    logger.userAction('Admin thesis approval attempted', { userId: user.id, userRole: user.role, thesisId });

    setActionLoading(thesisId);
    
    try {
      const result = await ThesisManagementService.approveThesis(thesisId, user.id);
      logger.info('Thesis approval successful', { result });

      if (result.success) {
        toast.success(result.message);
        
        // Invalidate and refetch all related queries
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['theses'] }),
          queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] }),
          queryClient.invalidateQueries({ queryKey: ['system-stats'] }),
          queryClient.refetchQueries({ queryKey: ['theses'] }),
          queryClient.refetchQueries({ queryKey: ['admin-dashboard'] })
        ]);
        
        // Close review dialog if open
        if (reviewDialogOpen && selectedThesis?.id === thesisId) {
          setReviewDialogOpen(false);
          setSelectedThesis(null);
        }
      } else {
        toast.error(result.message || 'Failed to approve thesis');
        console.error('Approval failed:', result.message);
      }
    } catch (error) {
      console.error('Error in handleApprove:', error);
      toast.error('An unexpected error occurred while approving the thesis');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (thesisId: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    logger.userAction('Admin thesis rejection attempted', { userId: user.id, userRole: user.role, thesisId });

    setActionLoading(thesisId);
    
    try {
      const result = await ThesisManagementService.rejectThesis(thesisId, user.id);
      logger.info('Thesis rejection successful', { result });

      if (result.success) {
        toast.success(result.message);
        
        // Invalidate and refetch all related queries
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['theses'] }),
          queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] }),
          queryClient.invalidateQueries({ queryKey: ['system-stats'] }),
          queryClient.refetchQueries({ queryKey: ['theses'] }),
          queryClient.refetchQueries({ queryKey: ['admin-dashboard'] })
        ]);
        
        // Close review dialog if open
        if (reviewDialogOpen && selectedThesis?.id === thesisId) {
          setReviewDialogOpen(false);
          setSelectedThesis(null);
        }
      } else {
        toast.error(result.message || 'Failed to reject thesis');
        console.error('Rejection failed:', result.message);
      }
    } catch (error) {
      console.error('Error in handleReject:', error);
      toast.error('An unexpected error occurred while rejecting the thesis');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReviewClick = (thesis: any) => {
    const thesisWithCollege = {
      ...thesis,
      colleges: colleges.find(c => c.id === thesis.college_id)
    };
    logger.userAction('Review dialog opened', { thesisId: thesisWithCollege.id });
    setSelectedThesis(thesisWithCollege);
    setReviewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: { label: 'Pending Review', variant: 'secondary' as const },
      approved: { label: 'Approved', variant: 'default' as const },
      needs_revision: { label: 'Needs Revision', variant: 'destructive' as const }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_review;
  };

  // Filter to show only theses that are actually pending review (not approved)
  const pendingTheses = theses.filter(thesis => 
    thesis.status === 'pending_review' || thesis.status === 'needs_revision'
  );

  return (
    <>
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Theses Pending Approval ({pendingTheses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {thesesLoading ? (
            <div className="text-gray-400 text-center py-8">Loading pending theses...</div>
          ) : pendingTheses.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No theses pending approval.</div>
          ) : (
            <div className="space-y-4">
              {pendingTheses.map((thesis) => (
                <div key={thesis.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{thesis.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span>{thesis.author}</span>
                      <span>•</span>
                      <Badge variant="secondary" className="bg-dlsl-green/10 text-dlsl-green border-0">
                        {(colleges.find(c => c.id === thesis.college_id)?.name) || thesis.college_id}
                      </Badge>
                      <span>•</span>
                      <span>{thesis.year || (thesis.publish_date && thesis.publish_date.slice(0, 4))}</span>
                    </div>
                    <Badge variant={getStatusBadge(thesis.status).variant}>
                      {getStatusBadge(thesis.status).label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {user?.role === 'admin' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleApprove(thesis.id)}
                          disabled={actionLoading === thesis.id}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          {actionLoading === thesis.id ? 'Processing...' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleReject(thesis.id)}
                          disabled={actionLoading === thesis.id}
                        >
                          <X className="w-4 h-4 mr-1" />
                          {actionLoading === thesis.id ? 'Processing...' : 'Reject'}
                        </Button>
                      </>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-gray-300"
                      onClick={() => handleReviewClick(thesis)}
                    >
                      <Eye className="w-4 w-4 mr-1 text-dlsl-green" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ThesisReviewDialog
        thesis={selectedThesis}
        open={reviewDialogOpen}
        onClose={() => {
          setReviewDialogOpen(false);
          setSelectedThesis(null);
        }}
        onApprove={() => selectedThesis && handleApprove(selectedThesis.id)}
        onReject={() => selectedThesis && handleReject(selectedThesis.id)}
        isLoading={actionLoading === selectedThesis?.id}
        userRole={user?.role || ''}
      />
    </>
  );
};

export default AdminRecentTheses;
