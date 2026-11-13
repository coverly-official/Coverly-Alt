import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BRAND_NAME } from '@/lib/config';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Factory
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { user, signOut, switchRole } = useAuth();
  const isBuyerRoute = location.pathname.includes('/dashboard/buyer');

  const buyerLinks = [
    { label: 'Buyer Overview', href: '/dashboard/buyer', icon: LayoutDashboard },
    { label: 'RFQ Pipeline', href: '/dashboard/buyer?tab=rfqs', icon: FileSpreadsheet },
    { label: 'Live Quotes', href: '/dashboard/buyer?tab=quotes', icon: FileText, badge: '3 Action' },
    { label: 'Escrow Vault', href: '/dashboard/buyer?tab=escrow', icon: ShieldCheck },
  ];

  const sellerLinks = [
    { label: 'Seller Portal', href: '/dashboard/seller', icon: LayoutDashboard },
    { label: 'Incoming RFQs', href: '/dashboard/seller?tab=incoming', icon: FileSpreadsheet, badge: '5 New' },
    { label: 'Factory Catalog', href: '/dashboard/seller?tab=products', icon: Building2 },
    { label: 'Escrow Milestones', href: '/dashboard/seller?tab=payouts', icon: ShieldCheck },
  ];

  const currentLinks = isBuyerRoute ? buyerLinks : sellerLinks;

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 bg-elevated border-r border-white/10 flex flex-col justify-between transition-all duration-300 z-30 select-none shrink-0',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div>
        {/* Brand header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-canvas border border-white/20 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 18L12 4L20 18H15L12 12.5L9 18H4Z" fill="#f7b117" />
              </svg>
            </div>
            {!collapsed && (
              <span className="font-display font-bold text-sm text-white tracking-tight truncate">
                {BRAND_NAME}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-ink-secondary hover:text-white hover:bg-white/5"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Toggle Switch: Buyer vs Seller Workspace */}
        <div className="p-3 border-b border-white/10">
          {!collapsed ? (
            <div className="p-1 rounded-xl bg-canvas flex items-center text-xs">
              <Link
                to="/dashboard/buyer"
                onClick={() => switchRole('buyer')}
                className={cn(
                  'flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors',
                  isBuyerRoute ? 'bg-elevated text-gold shadow-sm' : 'text-ink-secondary hover:text-white'
                )}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Buyer View</span>
              </Link>
              <Link
                to="/dashboard/seller"
                onClick={() => switchRole('seller')}
                className={cn(
                  'flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors',
                  !isBuyerRoute ? 'bg-elevated text-gold shadow-sm' : 'text-ink-secondary hover:text-white'
                )}
              >
                <Factory className="w-3.5 h-3.5" />
                <span>Supplier View</span>
              </Link>
            </div>
          ) : (
            <Link
              to={isBuyerRoute ? '/dashboard/seller' : '/dashboard/buyer'}
              onClick={() => switchRole(isBuyerRoute ? 'seller' : 'buyer')}
              className="w-10 h-10 mx-auto rounded-xl bg-canvas flex items-center justify-center text-gold hover:bg-canvas/80"
              title={isBuyerRoute ? 'Switch to Supplier View' : 'Switch to Buyer View'}
            >
              {isBuyerRoute ? <ShoppingCart className="w-4 h-4" /> : <Factory className="w-4 h-4" />}
            </Link>
          )}
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1.5">
          {currentLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname + location.search === item.href;

            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                  isActive
                    ? 'bg-canvas text-gold border border-gold/30 shadow-sm'
                    : 'text-ink-secondary hover:text-white hover:bg-canvas/50'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-gold' : 'text-ink-secondary')} />
                {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gold/15 text-gold border border-gold/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & footer */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-canvas/40">
          <div className="w-7 h-7 rounded-lg bg-gold/20 text-gold flex items-center justify-center font-bold text-xs shrink-0">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 truncate">
              <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
              <p className="text-[10px] text-ink-secondary truncate">{user?.company_name}</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => signOut()}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-status-error hover:bg-status-error/10 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
