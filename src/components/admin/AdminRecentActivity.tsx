
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

const AdminRecentActivity: React.FC = () => (
  <Card className="bg-white border-gray-200">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
        <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
        Recent Activity
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4 text-center text-gray-400 py-8">No recent activity to display.</div>
    </CardContent>
  </Card>
);

export default AdminRecentActivity;
