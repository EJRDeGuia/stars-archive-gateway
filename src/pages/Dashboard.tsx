
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
import { Sparkles, Search } from 'lucide-react';
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

          {/* Enhanced Semantic Search Button */}
          <div className="mb-12 flex justify-center">
            <div className="relative group">
              <Button
                type="button"
                onClick={() => navigate('/explore')}
                size="lg"
                className="relative bg-gradient-to-r from-dlsl-green to-dlsl-green-600 text-white font-semibold text-lg rounded-2xl px-10 py-5 shadow-xl border-0 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-dlsl-green/30 sleek-shadow-lg"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <div className="relative">
                    <Search 
                      className="w-6 h-6 text-white/90 transition-all duration-300 group-hover:scale-110"
                      strokeWidth={2}
                    />
                    <Sparkles 
                      className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className="tracking-wide font-medium">
                    Explore with AI Search
                  </span>
                </span>
                
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
              
              {/* Soft glow background */}
              <div className="absolute inset-0 bg-dlsl-green/20 rounded-2xl blur-xl scale-110 opacity-0 group-hover:opacity-60 transition-all duration-500 -z-10" />
            </div>
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
