import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  User, 
  Home,
  Bell,
  Menu,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleExploreClick = () => {
    navigate('/explore');
  };

  const handleCollectionsClick = () => {
    navigate('/collections');
  };

  return (
    <header className="bg-background/95 backdrop-blur-lg sleek-shadow border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Nav */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center hover:opacity-80 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-dlsl-green via-dlsl-green-light to-emerald-400 rounded-xl flex items-center justify-center sleek-shadow-lg group-hover:sleek-shadow-xl transition-all duration-200">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-dlsl-green to-dlsl-green-light bg-clip-text text-transparent ml-3 tracking-tight">
                STARS
              </span>
            </button>
            
            <div className="hidden md:flex ml-8 space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-600 dark:text-gray-200 hover:text-dlsl-green hover:bg-dlsl-green/10 dark:hover:text-dlsl-green dark:hover:bg-dlsl-green/10 rounded-xl px-4 py-2 font-medium transition-all duration-200"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-600 dark:text-gray-200 hover:text-dlsl-green hover:bg-dlsl-green/10 dark:hover:text-dlsl-green dark:hover:bg-dlsl-green/10 rounded-xl px-4 py-2 font-medium transition-all duration-200"
                onClick={handleExploreClick}
              >
                Explore
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-600 dark:text-gray-200 hover:text-dlsl-green hover:bg-dlsl-green/10 dark:hover:text-dlsl-green dark:hover:bg-dlsl-green/10 rounded-xl px-4 py-2 font-medium transition-all duration-200"
                onClick={handleCollectionsClick}
              >
                Collections
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-slate-600 dark:text-gray-200 hover:text-dlsl-green hover:bg-dlsl-green/10 dark:hover:text-dlsl-green dark:hover:bg-dlsl-green/10 rounded-xl"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Right Side */}
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-600 dark:text-gray-200 hover:text-dlsl-green hover:bg-dlsl-green/10 dark:hover:text-dlsl-green dark:hover:bg-dlsl-green/10 rounded-xl hidden md:flex relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl px-3 py-2 transition-all duration-200 sleek-shadow-sm hover:sleek-shadow"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-xl flex items-center justify-center sleek-shadow">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-gray-300 capitalize">{user.role.replace('_', ' ')}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 sleek-shadow-xl border-0 bg-white/95 dark:bg-background/95 backdrop-blur-lg">
                  <DropdownMenuLabel className="text-slate-700 font-semibold">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-200" />
                  <DropdownMenuItem 
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer hover:bg-dlsl-green/10 hover:text-dlsl-green transition-colors rounded-lg mx-1"
                  >
                    <Home className="mr-3 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer hover:bg-dlsl-green/10 hover:text-dlsl-green transition-colors rounded-lg mx-1"
                  >
                    <User className="mr-3 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  {/* ADDED: Settings link */}
                  <DropdownMenuItem 
                    onClick={() => navigate('/settings')}
                    className="cursor-pointer hover:bg-dlsl-green/10 hover:text-dlsl-green transition-colors rounded-lg mx-1"
                  >
                    <span className="mr-3 flex items-center">
                      {/* Only lucide-react "settings" is allowed */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 16 4.6c.42.14.8.36 1.12.68.34.34.54.75.68 1.12.15.38.1.8-.11 1.13A1.44 1.44 0 0 0 18 8a1.65 1.65 0 0 0 1.51 1h.09a2 2 0 0 1 0 4h-.09A1.65 1.65 0 0 0 19.4 15z"/></svg>
                    </span>
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-200" />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700 transition-colors rounded-lg mx-1"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-dlsl-green to-dlsl-green-light hover:from-dlsl-green-dark hover:to-dlsl-green text-white sleek-shadow-lg hover:sleek-shadow-xl transition-all duration-200 transform hover:scale-105 rounded-xl px-6 py-2 font-semibold"
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
      
      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </header>
  );
};

export default Header;
