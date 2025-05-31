
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, FileText, User, CheckCircle, Clock, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'thesis_upload' | 'user_registration' | 'approval' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'thesis_upload',
      title: 'New Thesis Uploaded',
      message: 'AI-Driven Educational Technologies by Dr. Maria Santos',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'user_registration',
      title: 'New User Registration',
      message: 'John Doe has registered as a researcher',
      time: '4 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'approval',
      title: 'Thesis Approved',
      message: 'Your thesis has been approved and published',
      time: '6 hours ago',
      read: true
    },
    {
      id: '4',
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance completed successfully',
      time: '1 day ago',
      read: true
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'thesis_upload':
        return <FileText className="w-5 h-5 text-dlsl-green" />;
      case 'user_registration':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'approval':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="fixed top-20 right-6 w-96 max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <Card className="bg-white border-0 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Notifications</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${
                    notification.read ? 'border-gray-200' : 'border-dlsl-green'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 truncate">{notification.title}</p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-dlsl-green rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <Button variant="outline" className="w-full">
                View All Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationPanel;
