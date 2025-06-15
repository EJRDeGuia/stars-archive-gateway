
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { User, Lock, Shield } from 'lucide-react';

interface AccountSettingsCardProps {}

const AccountSettingsCard: React.FC<AccountSettingsCardProps> = () => (
  <Card className="bg-background border-gray-200">
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
          <Input id="username" defaultValue="john.researcher" className="border-gray-300" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="display-name" className="text-gray-700">Display Name</Label>
          <Input id="display-name" defaultValue="John Researcher" className="border-gray-300" />
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
);

export default AccountSettingsCard;
