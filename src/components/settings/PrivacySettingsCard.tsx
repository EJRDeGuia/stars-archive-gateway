
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield } from 'lucide-react';

interface PrivacySettingsCardProps {
  privacy: {
    profileVisible: boolean;
    activityVisible: boolean;
    libraryVisible: boolean;
  };
  setPrivacy: React.Dispatch<React.SetStateAction<PrivacySettingsCardProps['privacy']>>;
}

const PrivacySettingsCard: React.FC<PrivacySettingsCardProps> = ({
  privacy, setPrivacy,
}) => (
  <Card className="bg-background border-gray-200">
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
        <Shield className="w-6 h-6 text-primary" />
        Privacy
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-gray-900">Public Profile</Label>
            <p className="text-sm text-gray-600">Make your profile visible to other users</p>
          </div>
          <Switch
            checked={privacy.profileVisible}
            onCheckedChange={(checked) =>
              setPrivacy({...privacy, profileVisible: checked})
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-gray-900">Show Activity</Label>
            <p className="text-sm text-gray-600">Let others see your reading activity</p>
          </div>
          <Switch
            checked={privacy.activityVisible}
            onCheckedChange={(checked) =>
              setPrivacy({...privacy, activityVisible: checked})
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-gray-900">Public Library</Label>
            <p className="text-sm text-gray-600">Make your saved papers visible to others</p>
          </div>
          <Switch
            checked={privacy.libraryVisible}
            onCheckedChange={(checked) =>
              setPrivacy({...privacy, libraryVisible: checked})
            }
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default PrivacySettingsCard;
