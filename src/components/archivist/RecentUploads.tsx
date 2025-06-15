
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Edit3, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: { label: 'Pending Review', variant: 'secondary' as const },
      approved: { label: 'Approved', variant: 'default' as const },
      needs_revision: { label: 'Needs Revision', variant: 'destructive' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_review;
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
      
      <Card>
        <CardContent className="p-6">
          {uploads.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No uploads found.</div>
          ) : (
            <div className="space-y-4">
              {uploads.map((thesis) => (
                <div key={thesis.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{thesis.title}</h3>
                    <p className="text-sm text-gray-600">by {thesis.author} • {thesis.college}</p>
                    <p className="text-xs text-gray-500 mt-1">Uploaded: {thesis.uploadDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusBadge(thesis.status).variant}>
                      {getStatusBadge(thesis.status).label}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
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
    </div>
  );
};

export default RecentUploads;
