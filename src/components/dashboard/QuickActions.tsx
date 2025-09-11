
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  Upload, 
  Star, 
  Library, 
  TrendingUp,
  Database,
  FileText
} from 'lucide-react';

interface QuickActionsProps {
  userRole: string;
  onActionClick: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ userRole, onActionClick }) => {
  const isAdmin = userRole === 'admin';
  const isArchivist = userRole === 'archivist';
  const canUpload = userRole === 'archivist';

  const actions = [
    ...(isAdmin ? [{
      id: 'admin',
      title: 'Admin Dashboard',
      description: 'Manage system & users',
      icon: Shield
    }] : []),
    ...(canUpload ? [{
      id: 'upload',
      title: 'Upload Thesis',
      description: 'Submit new research work',
      icon: Upload
    }] : []),
    ...(isArchivist ? [{
      id: 'manage',
      title: 'Manage Records',
      description: 'Review and organize theses',
      icon: FileText
    }] : []),
    ...(isAdmin ? [{
      id: 'backup',
      title: 'Backup Database',
      description: 'Create system backup',
      icon: Database
    }] : []),
    {
      id: 'collections',
      title: 'Collections',
      description: 'Browse curated research',
      icon: Star
    },
    {
      id: 'library',
      title: 'My Library',
      description: 'View saved research',
      icon: Library
    },
    {
      id: 'trending',
      title: 'Trending Research',
      description: 'Popular theses',
      icon: TrendingUp
    }
  ];

  return (
    <div className="mb-12 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h2>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          {actions.map((action) => (
            <Card 
              key={action.id}
              className="group shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg" 
              onClick={() => onActionClick(action.id)}
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

export default QuickActions;
