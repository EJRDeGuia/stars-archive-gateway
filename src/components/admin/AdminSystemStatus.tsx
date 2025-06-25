
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSystemStats } from "@/hooks/useSystemStats";

const AdminSystemStatus: React.FC = () => {
  const { data: systemStats } = useSystemStats();

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-green-800 font-medium">Database Status</span>
            <Badge className="bg-green-100 text-green-800 border-green-200">Online</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-green-800 font-medium">Network Access</span>
            <Badge className="bg-green-100 text-green-800 border-green-200">Secured</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <span className="text-yellow-800 font-medium">Backup Status</span>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Scheduled</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-green-800 font-medium">Active Users</span>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              {systemStats?.active_users?.value || 0}
            </Badge>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>Document Security:</strong> All thesis documents are protected. Users must contact the LRC directly for downloads or external access.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSystemStatus;
