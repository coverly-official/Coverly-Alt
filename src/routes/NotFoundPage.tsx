import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Compass, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center select-none">
      <GlassCard className="p-10 max-w-md w-full border border-white/15">
        <div className="w-16 h-16 rounded-2xl bg-elevated border border-white/20 flex items-center justify-center text-gold mx-auto mb-4">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <h1 className="text-3xl font-bold font-display text-white mb-2">404</h1>
        <h2 className="text-base font-bold text-white mb-2">Industrial Route Not Found</h2>
        <p className="text-xs text-ink-secondary mb-6 leading-relaxed">
          The requested page or procurement record does not exist or has been relocated to an archive.
        </p>
        <Link to="/">
          <Button variant="primary" className="w-full gap-2 font-bold">
            <span>Return to Global Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </GlassCard>
    </div>
  );
};

export default NotFoundPage;
