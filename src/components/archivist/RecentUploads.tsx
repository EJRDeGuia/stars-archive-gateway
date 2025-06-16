
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Edit3, Download, Trash2, Archive, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { ThesisManagementService } from '@/services/thesisManagement';
import CollectionSelectionDialog from '@/components/CollectionSelectionDialog';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface Upload {
  id: string;
  title: string;
  author: string;
  college: string;
  uploadDate: string;
  status: string;
}

interface RecentUploadsProps {
  uploads: Upload[];
}

const RecentUploads: React.FC<RecentUploadsProps> = ({ uploads }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string[]>([]);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const allIds = uploads.map((t) => t.id);
  const isAllSelected = selected.length === uploads.length && uploads.length > 0;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: { label: 'Pending Review', variant: 'secondary' as const },
      approved: { label: 'Approved', variant: 'default' as const },
      needs_revision: { label: 'Needs Revision', variant: 'destructive' as const }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_review;
  };

  const toggleSelectOne = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((sid) => sid !== id) : [...current, id]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) setSelected([]);
    else setSelected(allIds);
  };

  const handleBulkAction = async (action: string) => {
    if (selected.length === 0) return;

    setLoading(true);
    let result;

    try {
      switch (action) {
        case 'approve':
          result = await ThesisManagementService.bulkApprove(selected);
          break;
        case 'reject':
          result = await ThesisManagementService.bulkReject(selected);
          break;
        case 'move':
          setShowCollectionDialog(true);
          setLoading(false);
          return;
        case 'delete':
          result = await ThesisManagementService.bulkDelete(selected);
          break;
        default:
          toast.error('Unknown action');
          setLoading(false);
          return;
      }

      if (result?.success) {
        toast.success(result.message);
        setSelected([]);
        // Refresh the data
        queryClient.invalidateQueries({ queryKey: ['theses'] });
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      } else {
        toast.error(result?.message || 'Action failed');
      }
    } catch (error) {
      toast.error('An error occurred while performing the action');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToCollection = async (collectionId: string) => {
    setLoading(true);
    try {
      const result = await ThesisManagementService.moveToCollection(selected, collectionId);
      
      if (result.success) {
        toast.success(result.message);
        setSelected([]);
        queryClient.invalidateQueries({ queryKey: ['theses'] });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to move theses to collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Uploads</h2>
        <Button variant="outline" onClick={() => navigate('/archivist/manage')}>
          <FileText className="mr-2 h-4 w-4 text-dlsl-green" />
          View All
        </Button>
      </div>

      {/* Bulk Action Bar */}
      {selected.length > 0 && (
        <div className="mb-4 flex items-center gap-3 px-2 py-2 bg-dlsl-green/5 border border-dlsl-green/20 rounded-lg animate-in fade-in duration-300">
          <span className="text-sm font-medium text-gray-900">
            {selected.length} selected
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2" disabled={loading}>
                Bulk Actions <ArrowDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="z-50">
              <DropdownMenuLabel>Choose action</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleBulkAction('approve')}>
                <Archive className="h-4 w-4 mr-2 text-green-600" /> Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('reject')}>
                <Archive className="h-4 w-4 mr-2 text-yellow-700" /> Reject
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('move')}>
                <Archive className="h-4 w-4 mr-2 text-blue-700" /> Move to Collection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('delete')}>
                <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelected([])}
            className="text-gray-400"
          >
            Clear
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          {uploads.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No uploads found.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center px-2 py-2 border-b border-gray-200 bg-gray-100 rounded-t">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                  className="mr-4"
                />
                <span className="text-xs text-gray-700 font-semibold flex-1">Select All</span>
                <span className="w-32" />
              </div>
              {uploads.map((thesis) => (
                <div
                  key={thesis.id}
                  className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative ${
                    selected.includes(thesis.id) ? 'bg-dlsl-green/10 border-dlsl-green/70' : ''
                  }`}
                >
                  <Checkbox
                    checked={selected.includes(thesis.id)}
                    onCheckedChange={() => toggleSelectOne(thesis.id)}
                    aria-label={`Select thesis ${thesis.title}`}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{thesis.title}</h3>
                    <p className="text-sm text-gray-600">by {thesis.author} • {thesis.college}</p>
                    <p className="text-xs text-gray-500 mt-1">Uploaded: {thesis.uploadDate}</p>
                  </div>
                  <div className="flex items-center gap-3 pl-2">
                    <Badge variant={getStatusBadge(thesis.status).variant}>
                      {getStatusBadge(thesis.status).label}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/thesis/${thesis.id}`)}>
                        <Eye className="h-4 w-4 text-dlsl-green" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-4 w-4 text-dlsl-green" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 text-dlsl-green" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CollectionSelectionDialog
        open={showCollectionDialog}
        onClose={() => setShowCollectionDialog(false)}
        onConfirm={handleMoveToCollection}
        selectedCount={selected.length}
      />
    </div>
  );
};

export default RecentUploads;
