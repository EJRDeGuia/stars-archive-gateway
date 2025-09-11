
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminQuickActions from '@/components/AdminQuickActions';
import DebugUserInfo from '@/components/DebugUserInfo';
import { Shield } from 'lucide-react';
import React from 'react';
import { useAdminDashboardData } from '@/hooks/useAdminDashboardData';
import AdminStatsGrid from '@/components/admin/AdminStatsGrid';
import AdminCollegesOverview from '@/components/admin/AdminCollegesOverview';
import AdminRecentActivity from '@/components/admin/AdminRecentActivity';
import AdminSystemStatus from '@/components/admin/AdminSystemStatus';
import AdminRecentTheses from '@/components/admin/AdminRecentTheses';
import ViewsChart from "@/components/analytics/ViewsChart";
import { useSystemAnalytics } from "@/hooks/useSystemAnalytics";
import SystemValidation from '@/components/admin/SystemValidation';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Use custom hook to fetch admin dashboard data
  const { colleges, collegesLoading, theses, thesesLoading } = useAdminDashboardData();

  const handleCollegeClick = (collegeId: string) => {
    navigate(`/college/${collegeId}`);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'users':
        navigate('/user-management');
        break;
      case 'colleges':
        navigate('/college-management');
        break;
      case 'manage':
        navigate('/manage-records');
        break;
      case 'backup':
        navigate('/backup-management');
        break;
      case 'analytics':
        navigate('/analytics-dashboard');
        break;
      case 'settings':
        navigate('/system-settings');
        break;
      case 'security':
        navigate('/security-monitor');
        break;
      case 'audit':
        navigate('/audit-logs');
        break;
      case 'content':
        navigate('/admin/content');
        break;
      default:
        toast.info('Feature coming soon!');
        break;
    }
  };

  // Use custom hook to fetch system analytics data
  const { viewsSeries, uploadsSeries, loading: analyticsLoading } = useSystemAnalytics();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Debug component - only shows in development */}
          <DebugUserInfo />
          
          {/* Admin Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-dlsl-green rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xl text-gray-600">System Administration Portal</p>
              </div>
            </div>
          </div>

          {/* SYSTEM ANALYTICS */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ViewsChart
              title="Daily Thesis Views (last 7 days)"
              data={viewsSeries}
              legend="Views"
              color="#06b6d4"
            />
            <ViewsChart
              title="New Theses Uploaded (last 7 days)"
              data={uploadsSeries}
              legend="Uploads"
              color="#6366f1"
            />
          </div>

        <AdminStatsGrid />
        <div className="mb-12">
          <AdminQuickActions onActionClick={handleQuickAction} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <AdminRecentActivity />
          <AdminSystemStatus />
        </div>
        <div className="mb-12">
          <SystemValidation />
        </div>
          <AdminCollegesOverview
            colleges={colleges}
            collegesLoading={collegesLoading}
            onCollegeClick={handleCollegeClick}
          />
          <AdminRecentTheses
            theses={theses}
            thesesLoading={thesesLoading}
            colleges={colleges}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
