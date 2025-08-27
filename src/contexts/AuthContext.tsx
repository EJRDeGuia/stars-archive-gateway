
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

type UserRole = 'researcher' | 'archivist' | 'admin' | 'guest_researcher';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectPath?: string }>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        toast.error('Authentication error. Please try logging in again.');
      } finally {
        setIsLoading(false);
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    };

    checkUser();
  }, []);

  const loadUserProfile = async (authUser: User) => {
    try {
      console.log('Loading user profile for:', authUser.id);
      
      // Get user role - only one query needed
      const { data: userRole, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role:', error);
      }

      let role: UserRole = 'researcher'; // Default role

      // If no role exists, create one
      if (!userRole) {
        console.log('Creating default role for new user:', authUser.id);
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authUser.id,
            role: 'researcher'
          });

        if (insertError) {
          console.error('Error creating user role:', insertError);
          toast.error('Error setting up user role. Please contact support.');
        } else {
          console.log('Successfully created researcher role for user');
          role = 'researcher';
        }
      } else {
        role = userRole.role as UserRole;
        console.log('User role found:', role);
      }

      const userData = {
        id: authUser.id,
        name: authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
        role: role
      };

      console.log('Setting user data:', userData);
      setUser(userData);
      
      // Show welcome message for new users
      if (!userRole) {
        toast.success(`Welcome! You've been assigned the role of ${role}.`);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Error loading user profile. Please try refreshing the page.');
      
      // Set fallback user data to prevent blank screens
      setUser({
        id: authUser.id,
        name: authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
        role: 'researcher'
      });
    }
  };

  const getRoleDashboardPath = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'archivist':
        return '/archivist';
      case 'researcher':
      case 'guest_researcher':
      default:
        return '/dashboard';
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectPath?: string }> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        setIsLoading(false);
        return { success: false };
      }

      if (data.user) {
        console.log('Login successful, loading profile...');
        
        // Get user role to determine redirect path
        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        let role: UserRole = 'researcher'; // Default role
        if (!roleError && userRole) {
          role = userRole.role as UserRole;
        }

        // Load the user profile (this will trigger the auth state change)
        await loadUserProfile(data.user);
        
        const redirectPath = getRoleDashboardPath(role);
        console.log('Redirecting to:', redirectPath);
        
        setIsLoading(false);
        return { success: true, redirectPath };
      }
    } catch (error) {
      console.error('Login exception:', error);
      toast.error('Login failed. Please try again.');
    }
    
    setIsLoading(false);
    return { success: false };
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
