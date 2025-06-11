
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatisticsCards from '@/components/archivist/StatisticsCards';
import ArchivistQuickActions from '@/components/archivist/ArchivistQuickActions';
import CollegeGrid from '@/components/dashboard/CollegeGrid';
import RecentUploads from '@/components/archivist/RecentUploads';

const ArchivistDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for archivist dashboard
  const stats = {
    totalTheses: 549,
    pendingReview: 12,
    thisMonth: 23
  };

  const recentUploads = [
    {
      id: '1',
      title: 'Machine Learning Applications in Healthcare',
      author: 'John Smith',
      college: 'CITE',
      uploadDate: '2024-01-15',
      status: 'pending_review'
    },
    {
      id: '2',
      title: 'Sustainable Tourism Practices in the Philippines',
      author: 'Maria Garcia',
      college: 'CIHTM',
      uploadDate: '2024-01-14',
      status: 'approved'
    },
    {
      id: '3',
      title: 'Financial Technology Adoption in SMEs',
      author: 'Robert Johnson',
      college: 'CBEAM',
      uploadDate: '2024-01-13',
      status: 'needs_revision'
    }
  ];

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
      default:
        console.log('Unknown archivist action:', action);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

          <StatisticsCards stats={stats} />
          
          <ArchivistQuickActions onActionClick={handleQuickAction} />
          
          <CollegeGrid />
          
          <RecentUploads uploads={recentUploads} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArchivistDashboard;
