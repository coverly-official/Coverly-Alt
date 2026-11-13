import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BRAND_NAME, TAGLINE } from '@/lib/config';
import { Lock, Mail } from 'lucide-react';

export const SignInPage: React.FC = () => {
  const { signIn, continueAsDemo, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextUrl = searchParams.get('next') || '/dashboard/buyer';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await signIn(email, password);
    setIsLoading(false);
    if (!res.success) {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    } else {
      navigate(nextUrl);
    }
  };

  const handleDemoSignIn = (role: 'buyer' | 'seller') => {
    continueAsDemo(role);
    navigate(role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer');
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[rgba(103,111,157,0.2)] blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[rgba(124,92,255,0.15)] blur-[100px] pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-elevated border border-white/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 18L12 4L20 18H15L12 12.5L9 18H4Z" fill="#f7b117" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">
              {BRAND_NAME}
            </span>
          </Link>
          <p className="text-xs text-ink-secondary">{TAGLINE}</p>
        </div>

        <GlassCard variant="glass-strong" className="p-8 border border-white/15 shadow-2xl">
          <h2 className="text-xl font-bold font-display text-white tracking-tight mb-1 text-center">
            Sign In to Enterprise Workspace
          </h2>
          <p className="text-xs text-ink-secondary text-center mb-6">
            Direct access to your RFQs, factory quotes, and escrow accounts.
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-status-error/15 border border-status-error/30 text-xs text-status-error mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Corporate Email"
              type="email"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="procurement@enterprise.com"
            />

            <Input
              label="Password"
              type="password"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold shadow-lg"
            >
              Sign In to Procurement
            </Button>
          </form>

          {/* Google OAuth Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full h-11 px-4 rounded-xl bg-elevated/70 border border-white/15 hover:border-white/30 text-xs font-semibold text-white flex items-center justify-center gap-2.5 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.56 0 2.97.55 4.09 1.45l3.07-3.07C17.3 1.63 14.83 1 12 1 7.42 1 3.52 3.58 1.57 7.33l3.69 2.86C6.18 7.38 8.84 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.42-4.93 3.42-8.7z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.26 14.81c-.24-.73-.38-1.5-.38-2.31s.14-1.58.38-2.31L1.57 7.33C.57 9.38 0 11.63 0 12c0 2.37.57 4.62 1.57 6.67l3.69-2.86z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.07.72-2.45 1.16-4.22 1.16-3.16 0-5.82-2.38-6.74-5.19L1.57 16.04C3.52 19.79 7.42 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Quick Demo Mode Continuer */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary block">
              Demo Access (Zero Setup)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleDemoSignIn('buyer')}
                className="text-xs text-white"
              >
                Demo Buyer
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleDemoSignIn('seller')}
                className="text-xs text-white"
              >
                Demo Supplier
              </Button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-ink-secondary">
            Don&apos;t have an account?{' '}
            <Link to="/sign-up" className="text-gold hover:underline font-semibold">
              Apply for Sourcing Access
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default SignInPage;
