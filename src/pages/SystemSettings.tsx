
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import {
  Settings,
  ArrowLeft,
  Database,
  Shield,
  Mail,
  Globe,
  Save,
  Loader2
} from 'lucide-react';

const SystemSettings = () => {
  const navigate = useNavigate();
  const { 
    settings, 
    settingsMap, 
    isLoading, 
    updateSetting, 
    updateMultipleSettings, 
    isUpdating,
    getSettingValue 
  } = useSystemSettings();

  const handleSave = () => {
    const updates = [
      { id: settingsMap['site_name']?.id, value: settingsMap['site_name']?.parsedValue },
      { id: settingsMap['site_description']?.id, value: settingsMap['site_description']?.parsedValue },
      { id: settingsMap['max_file_size']?.id, value: settingsMap['max_file_size']?.parsedValue },
      { id: settingsMap['allowed_file_types']?.id, value: settingsMap['allowed_file_types']?.parsedValue },
      { id: settingsMap['enable_email_notifications']?.id, value: settingsMap['enable_email_notifications']?.parsedValue },
      { id: settingsMap['enable_auto_backup']?.id, value: settingsMap['enable_auto_backup']?.parsedValue },
      { id: settingsMap['backup_frequency']?.id, value: settingsMap['backup_frequency']?.parsedValue },
      { id: settingsMap['maintenance_mode']?.id, value: settingsMap['maintenance_mode']?.parsedValue },
      { id: settingsMap['enable_registration']?.id, value: settingsMap['enable_registration']?.parsedValue },
      { id: settingsMap['require_email_verification']?.id, value: settingsMap['require_email_verification']?.parsedValue }
    ].filter(update => update.id);

    if (updates.length > 0) {
      updateMultipleSettings(updates);
    }
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    const setting = settingsMap[key];
    if (setting) {
      updateSetting({ id: setting.id, value });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-dlsl-green" />
              <p className="mt-2 text-gray-600">Loading system settings...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Dashboard
              </Button>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-dlsl-green rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">System Settings</h1>
                <p className="text-xl text-gray-600">Configure system preferences and behavior</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* General Settings */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={getSettingValue('site_name', 'DLSL Thesis Repository')}
                    onChange={(e) => handleInputChange('site_name', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={getSettingValue('site_description', 'Digital repository for De La Salle Lipa theses and research papers')}
                    onChange={(e) => handleInputChange('site_description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={getSettingValue('max_file_size', '50')}
                    onChange={(e) => handleInputChange('max_file_size', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                  <Input
                    id="allowedFileTypes"
                    value={getSettingValue('allowed_file_types', 'pdf,doc,docx')}
                    onChange={(e) => handleInputChange('allowed_file_types', e.target.value)}
                    placeholder="pdf,doc,docx"
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Features */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  System Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableEmailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Send email notifications to users</p>
                  </div>
                  <Switch
                    id="enableEmailNotifications"
                    checked={getSettingValue('enable_email_notifications', true)}
                    onCheckedChange={(checked) => handleInputChange('enable_email_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableRegistration">User Registration</Label>
                    <p className="text-sm text-gray-600">Allow new user registrations</p>
                  </div>
                  <Switch
                    id="enableRegistration"
                    checked={getSettingValue('enable_registration', true)}
                    onCheckedChange={(checked) => handleInputChange('enable_registration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireEmailVerification">Email Verification</Label>
                    <p className="text-sm text-gray-600">Require email verification for new accounts</p>
                  </div>
                  <Switch
                    id="requireEmailVerification"
                    checked={getSettingValue('require_email_verification', true)}
                    onCheckedChange={(checked) => handleInputChange('require_email_verification', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-gray-600">Enable maintenance mode</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={getSettingValue('maintenance_mode', false)}
                    onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Backup Settings */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  Backup Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableAutoBackup">Automatic Backup</Label>
                    <p className="text-sm text-gray-600">Enable scheduled backups</p>
                  </div>
                  <Switch
                    id="enableAutoBackup"
                    checked={getSettingValue('enable_auto_backup', true)}
                    onCheckedChange={(checked) => handleInputChange('enable_auto_backup', checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <select
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dlsl-green"
                    value={getSettingValue('backup_frequency', 'daily')}
                    onChange={(e) => handleInputChange('backup_frequency', e.target.value)}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input
                    id="smtpServer"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    placeholder="587"
                  />
                </div>

                <div>
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    placeholder="your-email@gmail.com"
                  />
                </div>

                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    placeholder="your-app-password"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSave}
              className="bg-dlsl-green hover:bg-dlsl-green/90 text-white px-8 py-3"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {isUpdating ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SystemSettings;
