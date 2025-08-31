import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAnnouncements } from '@/hooks/useAnnouncements';

const AnnouncementBanner: React.FC = () => {
  const { highPriorityAnnouncements } = useAnnouncements();
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>(() => {
    const dismissed = localStorage.getItem('dismissedAnnouncements');
    return dismissed ? JSON.parse(dismissed) : [];
  });

  const visibleAnnouncements = highPriorityAnnouncements.filter(
    announcement => !dismissedAnnouncements.includes(announcement.id)
  );

  const dismissAnnouncement = (announcementId: string) => {
    const newDismissed = [...dismissedAnnouncements, announcementId];
    setDismissedAnnouncements(newDismissed);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed));
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAnnouncementVariant = (type: string): "default" | "destructive" => {
    return type === 'error' ? 'destructive' : 'default';
  };

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="space-y-2">
      {visibleAnnouncements.slice(0, 3).map((announcement) => (
        <Alert
          key={announcement.id}
          variant={getAnnouncementVariant(announcement.type)}
          className="relative"
        >
          {getAnnouncementIcon(announcement.type)}
          <AlertDescription className="pr-8">
            <span className="font-medium">{announcement.title}</span>
            {announcement.content && (
              <span className="ml-2">{announcement.content}</span>
            )}
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-6 w-6"
            onClick={() => dismissAnnouncement(announcement.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Alert>
      ))}
    </div>
  );
};

export default AnnouncementBanner;