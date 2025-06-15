import React, { useState } from 'react';
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
  Lock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AccountSettingsCard from "@/components/settings/AccountSettingsCard";
import NotificationSettingsCard from "@/components/settings/NotificationSettingsCard";
import PrivacySettingsCard from "@/components/settings/PrivacySettingsCard";
import DataAndStorageCard from "@/components/settings/DataAndStorageCard";

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

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully."
    });
  };

  return (
    <div className="min-h-screen bg-background">
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
            <AccountSettingsCard />
            <NotificationSettingsCard
              notifications={notifications}
              setNotifications={setNotifications}
            />
            <PrivacySettingsCard
              privacy={privacy}
              setPrivacy={setPrivacy}
            />
            <DataAndStorageCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
