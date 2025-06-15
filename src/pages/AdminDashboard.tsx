import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminQuickActions from '@/components/AdminQuickActions';
import { Shield } from 'lucide-react';
import React from 'react';
import { useAdminDashboardData } from '@/hooks/useAdminDashboardData';
import AdminStatsGrid from '@/components/admin/AdminStatsGrid';
import AdminCollegesOverview from '@/components/admin/AdminCollegesOverview';
import AdminRecentActivity from '@/components/admin/AdminRecentActivity';
import AdminSystemStatus from '@/components/admin/AdminSystemStatus';
import AdminRecentTheses from '@/components/admin/AdminRecentTheses';

// For now, provide fallback values. Replace with Supabase queries in the future.
const theses = [];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { colleges, collegesLoading, theses, thesesLoading } = useAdminDashboardData();

  // Statistics Calculation
  const stats = {
    totalUsers: 0,
    totalTheses: theses.length,
    totalColleges: colleges.length,
    monthlyUploads: 0,
    weeklyViews: 0,
    securityAlerts: 0,
    networkSessions: 0
  };

  const handleCollegeClick = (collegeId: string) => {
    navigate(`/college/${collegeId}`);
  };

  const handleBackupDatabase = () => {
    toast.success('Database backup initiated successfully!');
    console.log('Database backup started');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'users':
        navigate('/user-management');
        break;
      case 'colleges':
        navigate('/college-management');
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
      case 'backup':
        handleBackupDatabase();
        break;
      default:
        console.log('Unknown admin action:', action);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
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
          <AdminStatsGrid stats={stats} />
          <div className="mb-12">
            <AdminQuickActions onActionClick={handleQuickAction} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <AdminRecentActivity />
            <AdminSystemStatus networkSessions={stats.networkSessions} />
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
