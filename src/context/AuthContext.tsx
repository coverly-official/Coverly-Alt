import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, type AuthUser } from '@/services/auth';

interface AuthContextType {
  user: AuthUser | null;
  role: 'buyer' | 'seller' | 'both' | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, pass: string, meta: { role: 'buyer' | 'seller'; company_name: string; full_name: string }) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  continueAsDemo: (role: 'buyer' | 'seller') => void;
  switchRole: (role: 'buyer' | 'seller') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const u = await authService.getCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signIn = async (email: string, pass: string) => {
    const { user: loggedIn, error } = await authService.signInWithPassword(email, pass);
    if (error || !loggedIn) {
      return { success: false, error: error?.message || 'Login failed' };
    }
    setUser(loggedIn);
    return { success: true };
  };

  const signUp = async (
    email: string,
    pass: string,
    meta: { role: 'buyer' | 'seller'; company_name: string; full_name: string }
  ) => {
    const { user: registered, error } = await authService.signUp(email, pass, meta);
    if (error || !registered) {
      return { success: false, error: error?.message || 'Signup failed' };
    }
    setUser(registered);
    return { success: true };
  };

  const signInWithGoogle = async () => {
    await authService.signInWithOAuth('google');
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const continueAsDemo = (role: 'buyer' | 'seller') => {
    const demo = authService.setDemoRole(role);
    setUser(demo);
  };

  const switchRole = (role: 'buyer' | 'seller') => {
    if (!user) return;
    const updated: AuthUser = { ...user, role };
    localStorage.setItem('meridian_demo_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        continueAsDemo,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
