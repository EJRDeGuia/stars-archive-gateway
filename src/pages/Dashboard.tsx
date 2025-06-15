
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import QuickActions from '@/components/dashboard/QuickActions';
import CollegeGrid from '@/components/dashboard/CollegeGrid';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { semanticSearchService } from '@/services/semanticSearch';
// Add icon and Button
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

          {/* Interactive Semantic Search Button */}
          <div className="mb-12 flex justify-center">
            <Button
              type="button"
              onClick={() => navigate('/explore')}
              size="lg"
              className="group bg-dlsl-green text-white font-semibold text-lg rounded-xl px-8 py-4 shadow-lg relative overflow-hidden hover:bg-dlsl-green-dark hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-dlsl-green/50"
            >
              <span className="flex items-center gap-2">
                <Sparkles 
                  className="-ml-1 w-6 h-6 text-yellow-400 group-hover:animate-pulse transition-transform duration-200"
                  strokeWidth={2.2}
                  absoluteStrokeWidth
                />
                <span className="drop-shadow-sm tracking-wide">
                  Try Semantic Search
                </span>
              </span>
              {/* Decorative gradient "glow" */}
              <span
                className="absolute inset-0 pointer-events-none rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at 60% 40%, #fff9e5 0%, #fffbe2 30%, transparent 70%)',
                }}
              />
            </Button>
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
