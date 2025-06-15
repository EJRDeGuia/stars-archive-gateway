
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Building, AlertTriangle } from "lucide-react";

interface AdminStatsGridProps {
  stats: {
    totalUsers: number;
    totalTheses: number;
    totalColleges: number;
    monthlyUploads: number;
    securityAlerts: number;
    networkSessions: number;
  };
}

const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
    <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            <p className="text-dlsl-green text-sm font-medium">+12% this month</p>
          </div>
          <div className="w-12 h-12 bg-dlsl-green/10 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-dlsl-green" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Theses</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalTheses}</p>
            <p className="text-dlsl-green text-sm font-medium">+{stats.monthlyUploads} this month</p>
          </div>
          <div className="w-12 h-12 bg-dlsl-green/10 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-dlsl-green" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Colleges</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalColleges}</p>
            <p className="text-dlsl-green text-sm font-medium">Active programs</p>
          </div>
          <div className="w-12 h-12 bg-dlsl-green/10 rounded-2xl flex items-center justify-center">
            <Building className="w-6 h-6 text-dlsl-green" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Security Alerts</p>
            <p className="text-3xl font-bold text-gray-900">{stats.securityAlerts}</p>
            <p className="text-red-600 text-sm font-medium">Active monitoring</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AdminStatsGrid;
