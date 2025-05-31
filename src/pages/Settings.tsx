
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Bell, 
  Shield, 
  Palette, 
  Download, 
  Mail, 
  User, 
  Lock,
  Globe,
  Monitor,
  Moon,
  Sun
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newTheses: true,
    research: true,
    system: false
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    activityVisible: false,
    libraryVisible: true
  });

  const [theme, setTheme] = useState('light');

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="ghost" 
              className="mb-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Dashboard
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-xl text-gray-600">Manage your account preferences and settings</p>
              </div>
              <Button onClick={handleSave} className="bg-primary text-white">
                Save All Changes
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Account Settings */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                  <User className="w-6 h-6 text-primary" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-700">Username</Label>
                    <Input 
                      id="username" 
                      defaultValue="john.researcher" 
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display-name" className="text-gray-700">Display Name</Label>
                    <Input 
                      id="display-name" 
                      defaultValue="John Researcher" 
                      className="border-gray-300"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="justify-start border-gray-300">
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="justify-start border-gray-300">
                      <Shield className="mr-2 h-4 w-4" />
                      Two-Factor Authentication
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-white border-gray-200">
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

            {/* Privacy Settings */}
            <Card className="bg-white border-gray-200">
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

            {/* Appearance Settings */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                  <Palette className="w-6 h-6 text-primary" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'system', label: 'System', icon: Monitor }
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id)}
                          className={`p-4 rounded-xl border-2 transition-colors ${
                            theme === option.id 
                              ? 'border-primary bg-primary/10' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${
                            theme === option.id ? 'text-primary' : 'text-gray-600'
                          }`} />
                          <p className={`text-sm font-medium ${
                            theme === option.id ? 'text-primary' : 'text-gray-900'
                          }`}>
                            {option.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data & Storage */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                  <Download className="w-6 h-6 text-primary" />
                  Data & Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Download Data</h3>
                      <p className="text-sm text-gray-600">Export your account data and activity</p>
                    </div>
                    <Button variant="outline" className="border-gray-300">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Clear Cache</h3>
                      <p className="text-sm text-gray-600">Remove locally stored data to free up space</p>
                    </div>
                    <Button variant="outline" className="border-gray-300">
                      Clear Cache
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-red-600">Delete Account</h3>
                      <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
