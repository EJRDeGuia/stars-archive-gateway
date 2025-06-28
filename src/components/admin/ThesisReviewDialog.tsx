
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, GraduationCap, FileText, Check, X } from 'lucide-react';
import PDFViewer from '@/components/PDFViewer';

interface ThesisReviewDialogProps {
  thesis: any;
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  isLoading: boolean;
  userRole: string;
}

const ThesisReviewDialog: React.FC<ThesisReviewDialogProps> = ({
  thesis,
  open,
  onClose,
  onApprove,
  onReject,
  isLoading,
  userRole
}) => {
  if (!thesis) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: { label: 'Pending Review', variant: 'secondary' as const },
      approved: { label: 'Approved', variant: 'default' as const },
      needs_revision: { label: 'Needs Revision', variant: 'destructive' as const }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_review;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold pr-6">Thesis Review</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Thesis Details */}
          <div className="space-y-6">
            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              <Badge variant={getStatusBadge(thesis.status).variant}>
                {getStatusBadge(thesis.status).label}
              </Badge>
              
              {userRole === 'admin' && thesis.status === 'pending_review' && (
                <div className="flex gap-2">
                  <Button
                    onClick={onApprove}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {isLoading ? 'Processing...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={onReject}
                    disabled={isLoading}
                    variant="destructive"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {isLoading ? 'Processing...' : 'Reject'}
                  </Button>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{thesis.title}</h2>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Author:</span> {thesis.author}
                </span>
              </div>
              
              {thesis.adviser && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">Adviser:</span> {thesis.adviser}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Year:</span> {thesis.year || new Date(thesis.publish_date).getFullYear()}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">College:</span> {thesis.colleges?.name || 'Unknown'}
                </span>
              </div>
            </div>

            {/* Abstract */}
            {thesis.abstract && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Abstract</h3>
                <div className="p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed">{thesis.abstract}</p>
                </div>
              </div>
            )}

            {/* Keywords */}
            {thesis.keywords && thesis.keywords.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {thesis.keywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Submission Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Submission Information</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Submitted:</span> {new Date(thesis.created_at).toLocaleDateString()}</p>
                <p><span className="font-medium">Last Updated:</span> {new Date(thesis.updated_at).toLocaleDateString()}</p>
                {thesis.co_adviser && (
                  <p><span className="font-medium">Co-Adviser:</span> {thesis.co_adviser}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - PDF Viewer */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Document Preview</h3>
            <PDFViewer
              pdfUrl={thesis.pdf_url}
              title={thesis.title}
              canView={true} // Admin can always view
              maxPages={5} // Show first 5 pages for review
              className="h-[600px]"
              thesisId={thesis.id}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThesisReviewDialog;
