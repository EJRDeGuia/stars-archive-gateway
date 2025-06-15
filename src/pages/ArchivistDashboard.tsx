import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatisticsCards from '@/components/archivist/StatisticsCards';
import ArchivistQuickActions from '@/components/archivist/ArchivistQuickActions';
import CollegeGrid from '@/components/dashboard/CollegeGrid';
import RecentUploads from '@/components/archivist/RecentUploads';
import { useArchivistDashboardData } from '@/hooks/useArchivistDashboardData';
import ViewsChart from "@/components/analytics/ViewsChart";
import { useSystemAnalytics } from "@/hooks/useSystemAnalytics";

const ArchivistDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { stats, recentUploads, loading } = useArchivistDashboardData();
  const { viewsSeries, uploadsSeries, loading: analyticsLoading } = useSystemAnalytics();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'upload':
        navigate('/upload');
        break;
      case 'manage':
        toast.info('Manage Records feature coming soon!');
        break;
      case 'collections':
        navigate('/collections');
        break;
      case 'reports':
        toast.info('Reports feature coming soon!');
        break;
      case 'search':
        navigate('/explore');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        toast.info('Feature coming soon!');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name || 'Archivist'}!
            </h1>
            <p className="text-xl text-gray-600">
              Manage and organize the university's thesis repository with powerful tools designed for efficient archival management.
            </p>
          </div>

          {/* System Analytics */}
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

          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading stats...</div>
          ) : (
            <>
              <StatisticsCards stats={stats} />
              <ArchivistQuickActions onActionClick={handleQuickAction} />
              <CollegeGrid />
              <RecentUploads uploads={recentUploads} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArchivistDashboard;
