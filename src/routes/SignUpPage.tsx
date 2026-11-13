import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BRAND_NAME, TAGLINE } from '@/lib/config';
import { Mail, Lock, Building, User, Factory, ShoppingCart } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'buyer' | 'seller'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await signUp(email, password, {
      role,
      company_name: companyName,
      full_name: fullName,
    });

    setIsLoading(false);
    if (!res.success) {
      setError(res.error || 'Failed to create account.');
    } else {
      navigate(role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer');
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
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
            Register Procurement Account
          </h2>
          <p className="text-xs text-ink-secondary text-center mb-6">
            Join 12,000+ verified enterprise supply chain professionals.
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-canvas/80 border border-white/10 mb-5">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                role === 'buyer'
                  ? 'bg-gold text-canvas shadow-md'
                  : 'text-ink-secondary hover:text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>I am a Buyer</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                role === 'seller'
                  ? 'bg-gold text-canvas shadow-md'
                  : 'text-ink-secondary hover:text-white'
              }`}
            >
              <Factory className="w-3.5 h-3.5" />
              <span>I am a Manufacturer</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-status-error/15 border border-status-error/30 text-xs text-status-error mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              required
              leftIcon={<User className="w-4 h-4" />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. Helen Miller"
            />

            <Input
              label="Corporate Entity / Company Name"
              required
              leftIcon={<Building className="w-4 h-4" />}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Apex Industrial Systems GmbH"
            />

            <Input
              label="Corporate Email Address"
              type="email"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="helen.miller@apex.de"
            />

            <Input
              label="Password (min 8 characters)"
              type="password"
              required
              minLength={8}
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
              className="w-full font-bold shadow-lg mt-2"
            >
              {role === 'buyer' ? 'Create Sourcing Account' : 'Apply for Plant Verification'}
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-ink-secondary">
            Already registered?{' '}
            <Link to="/sign-in" className="text-gold hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default SignUpPage;
