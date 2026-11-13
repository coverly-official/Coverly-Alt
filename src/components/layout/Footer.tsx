import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_NAME, TAGLINE } from '@/lib/config';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-canvas border-t border-white/10 text-ink-body pt-16 pb-12 overflow-hidden">
      {/* Specular top rim border highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-elevated border border-white/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 18L12 4L20 18H15L12 12.5L9 18H4Z" fill="#f7b117" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                {BRAND_NAME}
              </span>
            </div>
            <p className="text-xs text-ink-secondary max-w-sm leading-relaxed">
              {TAGLINE} The premier industrial supply chain infrastructure network connecting audited Tier-1 manufacturers with global enterprise buyers through escrow-protected smart contracts.
            </p>

            {/* Newsletter input */}
            <div className="pt-2">
              <label htmlFor="newsletter-email" className="block text-xs font-semibold text-white mb-2">
                Industrial Intelligence & Pricing Index
              </label>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 max-w-sm">
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="procurement@enterprise.com"
                  className="flex-1 h-10 px-3 bg-elevated/70 text-xs text-white rounded-input border border-white/15 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to intelligence briefing"
                  className="h-10 px-4 rounded-input bg-gold hover:bg-gold-hover text-canvas font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Buyers Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
              For Buyers
            </h4>
            <ul className="space-y-2.5 text-xs text-ink-secondary">
              <li>
                <Link to="/catalog" className="hover:text-gold transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link to="/catalog?filter=suppliers" className="hover:text-gold transition-colors">
                  Verified Suppliers
                </Link>
              </li>
              <li>
                <Link to="/dashboard/buyer" className="hover:text-gold transition-colors">
                  Submit Bulk RFQ
                </Link>
              </li>
              <li>
                <a href="#escrow-assurance" className="hover:text-gold transition-colors">
                  Trade Escrow Guarantee
                </a>
              </li>
              <li>
                <Link to="/dashboard/buyer" className="hover:text-gold transition-colors">
                  Track Milestone Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Suppliers Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
              For Manufacturers
            </h4>
            <ul className="space-y-2.5 text-xs text-ink-secondary">
              <li>
                <Link to="/dashboard/seller" className="hover:text-gold transition-colors">
                  Supplier Portal
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className="hover:text-gold transition-colors">
                  Apply for Verification
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-gold transition-colors">
                  Audit Standards (SGS/TÜV)
                </a>
              </li>
              <li>
                <Link to="/dashboard/seller" className="hover:text-gold transition-colors">
                  BOM Direct Quoting
                </Link>
              </li>
              <li>
                <a href="#escrow-assurance" className="hover:text-gold transition-colors">
                  Escrow Instant Payouts
                </a>
              </li>
            </ul>
          </div>

          {/* Governance & Compliance Badges */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
              Audited Standards
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-elevated/40 border border-white/5 text-ink-secondary">
                <ShieldCheck className="w-4 h-4 text-white/60 shrink-0" />
                <span className="font-mono text-[11px]">ISO 9001</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-elevated/40 border border-white/5 text-ink-secondary">
                <ShieldCheck className="w-4 h-4 text-white/60 shrink-0" />
                <span className="font-mono text-[11px]">ISO 13485</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-elevated/40 border border-white/5 text-ink-secondary">
                <ShieldCheck className="w-4 h-4 text-white/60 shrink-0" />
                <span className="font-mono text-[11px]">AS9100D</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-elevated/40 border border-white/5 text-ink-secondary">
                <ShieldCheck className="w-4 h-4 text-white/60 shrink-0" />
                <span className="font-mono text-[11px]">CE & RoHS</span>
              </div>
            </div>
            <p className="text-[11px] text-ink-tertiary mt-3 leading-relaxed">
              Every facility verified on-site by accredited global registrars.
            </p>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-secondary">
          <p>© {new Date().getFullYear()} {BRAND_NAME} AG. All international manufacturing rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Trade
            </a>
            <a href="#escrow-rules" className="hover:text-white transition-colors">
              Escrow Operating Rules
            </a>
            <a href="#privacy" className="hover:text-white transition-colors">
              B2B Privacy Policy
            </a>
            <a href="#security" className="hover:text-white transition-colors">
              Security Whitepaper
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
