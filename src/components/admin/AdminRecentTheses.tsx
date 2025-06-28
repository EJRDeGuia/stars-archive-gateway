
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Eye, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThesisManagementService } from "@/services/thesisManagement";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
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

  const handleQuickAction = async (thesisId: string, action: 'approve' | 'reject') => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    if (user.role !== 'admin') {
      toast.error('Only administrators can approve or reject theses');
      return;
    }

    console.log(`Starting ${action} action for thesis:`, thesisId);
    setActionLoading(thesisId);
    
    try {
      let result;
      if (action === 'approve') {
        result = await ThesisManagementService.bulkApprove([thesisId], user.id);
      } else {
        result = await ThesisManagementService.bulkReject([thesisId], user.id);
      }

      console.log('Action result:', result);

      if (result.success) {
        toast.success(result.message);
        // Invalidate all relevant queries to refresh data
        await queryClient.invalidateQueries({ queryKey: ['theses'] });
        await queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
        
        // Close review dialog if open
        if (reviewDialogOpen && selectedThesis?.id === thesisId) {
          setReviewDialogOpen(false);
          setSelectedThesis(null);
        }
      } else {
        toast.error(result.message);
        console.error('Action failed:', result.message);
      }
    } catch (error) {
      const errorMessage = 'An error occurred while updating the thesis';
      toast.error(errorMessage);
      console.error('Error in handleQuickAction:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReviewClick = (thesis: any) => {
    // Add college information to thesis object
    const thesisWithCollege = {
      ...thesis,
      colleges: colleges.find(c => c.id === thesis.college_id)
    };
    console.log('Opening review dialog for thesis:', thesisWithCollege);
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

  // Filter to show only pending theses for approval
  const pendingTheses = theses.filter(thesis => thesis.status === 'pending_review');

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
                          onClick={() => handleQuickAction(thesis.id, 'approve')}
                          disabled={actionLoading === thesis.id}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          {actionLoading === thesis.id ? 'Processing...' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleQuickAction(thesis.id, 'reject')}
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
        onApprove={() => selectedThesis && handleQuickAction(selectedThesis.id, 'approve')}
        onReject={() => selectedThesis && handleQuickAction(selectedThesis.id, 'reject')}
        isLoading={actionLoading === selectedThesis?.id}
        userRole={user?.role || ''}
      />
    </>
  );
};

export default AdminRecentTheses;
