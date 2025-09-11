import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBackupManager } from '@/hooks/useBackupManager';
import { Database, Download, Shield, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const BackupManagementPanel: React.FC = () => {
  const { 
    backups, 
    isLoading, 
    createBackup, 
    verifyBackup, 
    restoreBackup, 
    cleanupOldBackups,
    isCreatingBackup,
    isVerifying,
    isRestoring,
    isCleaning
  } = useBackupManager();

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Backup Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => createBackup('full')} 
            disabled={isCreatingBackup}
            size="sm"
          >
            <Database className="w-4 h-4 mr-2" />
            Full Backup
          </Button>
          <Button 
            onClick={() => createBackup('incremental')} 
            disabled={isCreatingBackup}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Incremental
          </Button>
          <Button 
            onClick={() => cleanupOldBackups()} 
            disabled={isCleaning}
            variant="outline"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Cleanup Old
          </Button>
        </div>

        {/* Backup List */}
        <div className="space-y-3">
          <h4 className="font-medium">Recent Backups</h4>
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">Loading backups...</div>
          ) : backups.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No backups found</div>
          ) : (
            backups.slice(0, 5).map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={backup.backup_status === 'completed' ? 'default' : 'secondary'}>
                      {backup.backup_type}
                    </Badge>
                    <span className="text-sm font-medium">{backup.backup_status}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(backup.backup_size_bytes)} • {formatDistanceToNow(new Date(backup.created_at), { addSuffix: true })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => verifyBackup(backup.id)}
                    disabled={isVerifying}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Verify
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => restoreBackup(backup.id)}
                    disabled={isRestoring}
                  >
                    Restore
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BackupManagementPanel;