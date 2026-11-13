import { insforge, isInsForgeConfigured } from '@/lib/insforge';

export interface AuthUser {
  id: string;
  email: string;
  role: 'buyer' | 'seller' | 'both';
  company_name: string;
  full_name: string;
}

export const authService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    // Check local storage demo user first
    const demoStored = localStorage.getItem('meridian_demo_user');
    if (demoStored) {
      try {
        return JSON.parse(demoStored);
      } catch {
        localStorage.removeItem('meridian_demo_user');
      }
    }

    if (!isInsForgeConfigured) {
      return null;
    }

    try {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (error || !data?.user) {
        return null;
      }

      const u = data.user;
      const meta = (u.metadata || {}) as Record<string, unknown>;
      return {
        id: u.id,
        email: u.email || 'user@meridiantrade.com',
        role: (meta.role as 'buyer' | 'seller' | 'both') || 'buyer',
        company_name: (meta.company_name as string) || 'Acme Procurement Corp',
        full_name: (meta.full_name as string) || 'Procurement Officer',
      };
    } catch {
      return null;
    }
  },

  async signInWithPassword(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
    if (!isInsForgeConfigured) {
      // Simulate successful demo login
      const demoUser: AuthUser = {
        id: 'buyer-demo-01',
        email,
        role: email.includes('seller') ? 'seller' : 'buyer',
        company_name: email.includes('seller') ? 'Kronos Precision Mechanics GmbH' : 'Vanguard Defense Systems',
        full_name: 'Lead Procurement Director',
      };
      localStorage.setItem('meridian_demo_user', JSON.stringify(demoUser));
      return { user: demoUser, error: null };
    }

    try {
      const { data, error } = await insforge.auth.signInWithPassword({ email, password });
      if (error || !data?.user) {
        return { user: null, error: error ? new Error(error.message) : new Error('Invalid credentials') };
      }

      const u = data.user;
      const meta = (u.metadata || {}) as Record<string, unknown>;
      const user: AuthUser = {
        id: u.id,
        email: u.email || email,
        role: (meta.role as 'buyer' | 'seller' | 'both') || 'buyer',
        company_name: (meta.company_name as string) || 'Meridian Enterprise Partner',
        full_name: (meta.full_name as string) || 'Enterprise Buyer',
      };
      return { user, error: null };
    } catch (err) {
      return { user: null, error: err as Error };
    }
  },

  async signUp(
    email: string,
    password: string,
    metadata: { role: 'buyer' | 'seller' | 'both'; company_name: string; full_name: string }
  ): Promise<{ user: AuthUser | null; error: Error | null }> {
    if (!isInsForgeConfigured) {
      const demoUser: AuthUser = {
        id: `user-${Date.now().toString().slice(-6)}`,
        email,
        role: metadata.role,
        company_name: metadata.company_name,
        full_name: metadata.full_name,
      };
      localStorage.setItem('meridian_demo_user', JSON.stringify(demoUser));
      return { user: demoUser, error: null };
    }

    try {
      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        // @ts-expect-error insforge metadata options
        options: {
          data: metadata,
        },
      });

      if (error || !data?.user) {
        return { user: null, error: error ? new Error(error.message) : new Error('Signup failed') };
      }

      const u = data.user;
      const user: AuthUser = {
        id: u.id,
        email: u.email || email,
        role: metadata.role,
        company_name: metadata.company_name,
        full_name: metadata.full_name,
      };
      return { user, error: null };
    } catch (err) {
      return { user: null, error: err as Error };
    }
  },

  async signInWithOAuth(provider: 'google' | 'github'): Promise<void> {
    if (!isInsForgeConfigured) {
      const demoUser: AuthUser = {
        id: 'buyer-demo-01',
        email: 'alex.vance@vanguard-corp.com',
        role: 'buyer',
        company_name: 'Vanguard Global Procurement',
        full_name: 'Alex Vance',
      };
      localStorage.setItem('meridian_demo_user', JSON.stringify(demoUser));
      window.location.href = '/dashboard/buyer';
      return;
    }

    await insforge.auth.signInWithOAuth({
      provider,
      redirectTo: `${window.location.origin}/dashboard/buyer`,
    });
  },

  async signOut(): Promise<void> {
    localStorage.removeItem('meridian_demo_user');
    if (isInsForgeConfigured) {
      try {
        await insforge.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
  },

  setDemoRole(role: 'buyer' | 'seller') {
    const demoUser: AuthUser = {
      id: role === 'buyer' ? 'buyer-demo-01' : 'sup-kronos-precision',
      email: role === 'buyer' ? 'procurement@vanguard-industrial.com' : 'sales@kronos-precision.de',
      role,
      company_name: role === 'buyer' ? 'Vanguard Heavy Industrial Systems' : 'Kronos Precision Mechanics GmbH',
      full_name: role === 'buyer' ? 'Elena Rostova' : 'Dr. Martin Vogel',
    };
    localStorage.setItem('meridian_demo_user', JSON.stringify(demoUser));
    return demoUser;
  },
};
