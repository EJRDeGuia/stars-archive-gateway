
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  Database, 
  FolderOpen, 
  Calendar, 
  Search, 
  User 
} from 'lucide-react';
import { ReportService } from '@/services/reportService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ArchivistQuickActionsProps {
  onActionClick: (action: string) => void;
}

const ArchivistQuickActions: React.FC<ArchivistQuickActionsProps> = ({ onActionClick }) => {
  const navigate = useNavigate();

  const handleReportsClick = async () => {
    toast.info('Generating thesis report...');
    try {
      const result = await ReportService.generateThesesReport();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const handleManageClick = () => {
    // Navigate to a manage records page (you may need to create this)
    navigate('/archivist/manage-records');
  };

  const handleCollectionsClick = () => {
    navigate('/collections');
  };

  const actions = [
    {
      id: 'upload',
      title: 'Upload Thesis',
      description: 'Add new thesis to repository',
      icon: Upload,
      onClick: () => onActionClick('upload')
    },
    {
      id: 'manage',
      title: 'Manage Records',
      description: 'Edit and organize theses',
      icon: Database,
      onClick: handleManageClick
    },
    {
      id: 'collections',
      title: 'Collections',
      description: 'Organize by topic or theme',
      icon: FolderOpen,
      onClick: handleCollectionsClick
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Generate archival reports',
      icon: Calendar,
      onClick: handleReportsClick
    },
    {
      id: 'search',
      title: 'Advanced Search',
      description: 'Find specific theses',
      icon: Search,
      onClick: () => onActionClick('search')
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'Manage your account',
      icon: User,
      onClick: () => onActionClick('profile')
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Archivist Tools</h2>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          {actions.map((action) => (
            <Card 
              key={action.id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group" 
              onClick={action.onClick}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-dlsl-green/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-dlsl-green group-hover:scale-110 transition-all duration-300">
                  <action.icon className="h-8 w-8 text-dlsl-green group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchivistQuickActions;
