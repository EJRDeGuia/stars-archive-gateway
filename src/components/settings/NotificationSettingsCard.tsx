
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell } from 'lucide-react';

interface NotificationSettingsCardProps {
  notifications: {
    email: boolean;
    push: boolean;
    newTheses: boolean;
    research: boolean;
    system: boolean;
  };
  setNotifications: React.Dispatch<React.SetStateAction<NotificationSettingsCardProps['notifications']>>;
}

const NotificationSettingsCard: React.FC<NotificationSettingsCardProps> = ({
  notifications, setNotifications,
}) => (
  <Card className="bg-background border-gray-200">
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
        <Bell className="w-6 h-6 text-primary" />
        Notifications
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-gray-900">Email Notifications</Label>
            <p className="text-sm text-gray-600">Receive notifications via email</p>
          </div>
          <Switch
            checked={notifications.email}
            onCheckedChange={(checked) =>
              setNotifications({...notifications, email: checked})
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-gray-900">Push Notifications</Label>
            <p className="text-sm text-gray-600">Receive push notifications in browser</p>
          </div>
          <Switch
            checked={notifications.push}
            onCheckedChange={(checked) =>
              setNotifications({...notifications, push: checked})
            }
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-gray-900">New Theses</Label>
            <p className="text-sm text-gray-600">Notify when new research papers are uploaded</p>
          </div>
          <Switch
            checked={notifications.newTheses}
            onCheckedChange={(checked) =>
              setNotifications({...notifications, newTheses: checked})
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-gray-900">Research Updates</Label>
            <p className="text-sm text-gray-600">Notify about research in your field of interest</p>
          </div>
          <Switch
            checked={notifications.research}
            onCheckedChange={(checked) =>
              setNotifications({...notifications, research: checked})
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-gray-900">System Updates</Label>
            <p className="text-sm text-gray-600">Notify about system maintenance and updates</p>
          </div>
          <Switch
            checked={notifications.system}
            onCheckedChange={(checked) =>
              setNotifications({...notifications, system: checked})
            }
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default NotificationSettingsCard;
