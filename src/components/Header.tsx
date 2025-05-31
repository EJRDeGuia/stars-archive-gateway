
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-lg sleek-shadow border-b border-slate-200/60 sticky top-0 z-50">
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
                className="text-slate-600 hover:text-dlsl-green hover:bg-dlsl-green/10 rounded-xl px-4 py-2 font-medium transition-all duration-200"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-600 hover:text-dlsl-green hover:bg-dlsl-green/10 rounded-xl px-4 py-2 font-medium transition-all duration-200"
              >
                Explore
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-600 hover:text-dlsl-green hover:bg-dlsl-green/10 rounded-xl px-4 py-2 font-medium transition-all duration-200"
              >
                Collections
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-slate-600 hover:text-dlsl-green hover:bg-dlsl-green/10 rounded-xl"
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
                className="text-slate-600 hover:text-dlsl-green hover:bg-dlsl-green/10 rounded-xl hidden md:flex relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-3 hover:bg-slate-50 rounded-xl px-3 py-2 transition-all duration-200 sleek-shadow-sm hover:sleek-shadow"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-dlsl-green to-dlsl-green-light rounded-xl flex items-center justify-center sleek-shadow">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 sleek-shadow-xl border-0 bg-white/95 backdrop-blur-lg">
                  <DropdownMenuLabel className="text-slate-700 font-semibold">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-200" />
                  <DropdownMenuItem 
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer hover:bg-dlsl-green/10 hover:text-dlsl-green transition-colors rounded-lg mx-1"
                  >
                    <Home className="mr-3 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-dlsl-green/10 hover:text-dlsl-green transition-colors rounded-lg mx-1">
                    <User className="mr-3 h-4 w-4" />
                    <span>Profile Settings</span>
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
    </header>
  );
};

export default Header;
