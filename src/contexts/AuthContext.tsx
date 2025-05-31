
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'researcher' | 'archivist' | 'admin' | 'guest_researcher';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration with updated names
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Researcher User',
    email: 'researcher@dlsl.edu.ph',
    role: 'researcher',
    password: 'password123'
  },
  {
    id: '2',
    name: 'Archivist User',
    email: 'archivist@dlsl.edu.ph',
    role: 'archivist',
    password: 'password123'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@dlsl.edu.ph',
    role: 'admin',
    password: 'password123'
  },
  {
    id: '4',
    name: 'Guest Researcher',
    email: 'guest@dlsl.edu.ph',
    role: 'guest_researcher',
    password: 'password123'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session on app load
    const storedUser = localStorage.getItem('stars_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
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
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stars_user');
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
