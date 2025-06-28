
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

type UserRole = 'researcher' | 'archivist' | 'admin' | 'guest_researcher';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Development mode flag - set to false for production
const isDevelopment = true;

// Mock users for development
const mockUsers: (AppUser & { password: string })[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Researcher User',
    email: 'researcher@dlsl.edu.ph',
    role: 'researcher',
    password: 'password123'
  },
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    name: 'Archivist User',
    email: 'archivist@dlsl.edu.ph',
    role: 'archivist',
    password: 'password123'
  },
  {
    id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    name: 'Admin User',
    email: 'admin@dlsl.edu.ph',
    role: 'admin',
    password: 'password123'
  },
  {
    id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    name: 'Guest Researcher',
    email: 'guest@dlsl.edu.ph',
    role: 'guest_researcher',
    password: 'password123'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      if (isDevelopment) {
        // In development, check localStorage for mock session
        const storedUser = localStorage.getItem('stars_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Simulate getting user profile from database
          setUser(userData);
        }
        setIsLoading(false);
      } else {
        // In production, use real Supabase auth
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user);
        }
        setIsLoading(false);

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            await loadUserProfile(session.user);
          } else {
            setUser(null);
          }
        });

        return () => subscription.unsubscribe();
      }
    };

    checkUser();
  }, []);

  const loadUserProfile = async (authUser: User) => {
    try {
      // Use has_role function to get user role
      const { data: isAdmin } = await supabase.rpc('has_role', {
        _user_id: authUser.id,
        _role: 'admin'
      });
      
      const { data: isArchivist } = await supabase.rpc('has_role', {
        _user_id: authUser.id,
        _role: 'archivist'
      });
      
      const { data: isGuestResearcher } = await supabase.rpc('has_role', {
        _user_id: authUser.id,
        _role: 'guest_researcher'
      });

      let userRole: UserRole = 'researcher'; // default
      if (isAdmin) userRole = 'admin';
      else if (isArchivist) userRole = 'archivist';
      else if (isGuestResearcher) userRole = 'guest_researcher';

      setUser({
        id: authUser.id,
        name: authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
        role: userRole
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Set default user data if role lookup fails
      setUser({
        id: authUser.id,
        name: authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
        role: 'researcher'
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    if (isDevelopment) {
      // Development mock login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('stars_user', JSON.stringify(userWithoutPassword));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } else {
      // Production Supabase auth
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          await loadUserProfile(data.user);
          setIsLoading(false);
          return true;
        }
      } catch (error) {
        console.error('Login error:', error);
      }
      
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    if (isDevelopment) {
      setUser(null);
      localStorage.removeItem('stars_user');
    } else {
      await supabase.auth.signOut();
      setUser(null);
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
