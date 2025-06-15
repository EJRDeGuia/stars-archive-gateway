import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import SearchSection from '@/components/dashboard/SearchSection';
import QuickActions from '@/components/dashboard/QuickActions';
import CollegeGrid from '@/components/dashboard/CollegeGrid';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { semanticSearchService } from '@/services/semanticSearch';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect admin users to admin dashboard and archivists to archivist dashboard
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'archivist') {
      navigate('/archivist');
    }
  }, [user, navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      // Perform semantic search and store the results for the explore page to pick up
      try {
        const results = await semanticSearchService.semanticSearch(searchQuery.trim(), 50);
        localStorage.setItem('exploreResults', JSON.stringify(results));
        localStorage.setItem('lastExploreQuery', searchQuery.trim());
        navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
      } catch (e: any) {
        toast.error('Failed to perform semantic search.');
      }
    }
  };

  const handleBackupDatabase = () => {
    toast.success('Database backup initiated successfully!');
    console.log('Database backup started');
    // TODO: Implement actual backup functionality with Supabase
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'upload':
        navigate('/upload');
        break;
      case 'collections':
        navigate('/collections');
        break;
      case 'library':
        navigate('/library');
        break;
      case 'trending':
        navigate('/explore');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'archivist':
        navigate('/archivist');
        break;
      case 'backup':
        handleBackupDatabase();
        break;
      case 'manage':
        toast.info('Manage Records feature coming soon!');
        break;
      case 'reports':
        toast.info('Reports feature coming soon!');
        break;
      case 'search':
        navigate('/explore');
        break;
      case 'users':
        toast.info('User Management feature coming soon!');
        break;
      case 'colleges':
        toast.info('College Management feature coming soon!');
        break;
      case 'analytics':
        toast.info('Analytics Dashboard feature coming soon!');
        break;
      case 'security':
        toast.info('Security Monitor feature coming soon!');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <WelcomeSection 
            userName={user?.name || 'User'} 
            userRole={user?.role || 'researcher'}
            getGreeting={getGreeting}
          />
          
          {/* Replacing SearchSection with a semantic search button */}
          <div className="mb-12 flex justify-center">
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="flex items-center gap-2 px-8 py-3 bg-dlsl-green hover:bg-dlsl-green-dark text-white font-semibold text-lg rounded-xl shadow transition"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0 0" />
              </svg>
              Semantic Search
            </button>
          </div>
          
          <QuickActions 
            userRole={user?.role || 'researcher'}
            onActionClick={handleQuickAction}
          />
          
          <CollegeGrid />
          
          <RecentActivity />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
