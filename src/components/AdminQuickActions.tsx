
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  BookOpen,
  Building,
  BarChart,
  Settings,
  Shield,
  Database,
  FileText
} from 'lucide-react';

interface AdminQuickActionsProps {
  onActionClick: (action: string) => void;
}

const AdminQuickActions: React.FC<AdminQuickActionsProps> = ({ onActionClick }) => {
  const quickActions = [
    {
      id: 'users',
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: Users,
      color: 'bg-dlsl-green'
    },
    {
      id: 'colleges',
      title: 'Manage Colleges',
      description: 'Configure college settings',
      icon: Building,
      color: 'bg-dlsl-green'
    },
    {
      id: 'manage',
      title: 'Manage Records',
      description: 'Review and approve theses',
      icon: FileText,
      color: 'bg-dlsl-green'
    },
    {
      id: 'backup',
      title: 'Backup Database',
      description: 'Create system backup',
      icon: Database,
      color: 'bg-dlsl-green'
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'System usage reports',
      icon: BarChart,
      color: 'bg-dlsl-green'
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Settings,
      color: 'bg-dlsl-green'
    }
  ];

  return (
    <div className="flex justify-center">
      <Card className="bg-white border-gray-200 w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-3 border-gray-200 hover:border-dlsl-green hover:bg-dlsl-green/5 transition-all duration-200 w-full"
                  onClick={() => onActionClick(action.id)}
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQuickActions;
