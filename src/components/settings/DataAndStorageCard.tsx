
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download } from 'lucide-react';

interface DataAndStorageCardProps {}

const DataAndStorageCard: React.FC<DataAndStorageCardProps> = () => (
  <Card className="bg-background border-gray-200">
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
);

export default DataAndStorageCard;
