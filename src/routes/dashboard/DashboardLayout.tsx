import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { CommandSearch } from '@/components/layout/CommandSearch';
import { useAuth } from '@/context/AuthContext';
import { isInsForgeConfigured } from '@/lib/insforge';
import { Bell, Database } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-canvas flex text-ink-body">
      {/* Navigation Rail */}
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />

      {/* Main Workspace (Solid #2d3250) */}
      <div className="flex-1 min-w-0 flex flex-col bg-canvas">
        {/* Top Header Bar */}
        <header className="h-16 px-6 bg-canvas border-b border-white/10 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex-1 max-w-md">
            <CommandSearch variant="nav" />
          </div>

          <div className="flex items-center gap-4">
            {/* Unobtrusive Demo Data / Live Cloud Status Chip */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-elevated/80 border border-white/10 text-[11px] text-ink-secondary select-none">
              <Database className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>{isInsForgeConfigured ? 'InsForge Cloud Connected' : 'Demo Data (Offline Mode)'}</span>
            </div>

            {/* Notifications Icon */}
            <button
              type="button"
              className="relative p-2 rounded-xl text-ink-secondary hover:text-white hover:bg-elevated transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold" />
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="w-7 h-7 rounded-lg bg-gold/20 text-gold flex items-center justify-center font-bold text-xs">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-semibold text-white hidden md:inline truncate max-w-[120px]">
                {user?.company_name}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Content Workspace */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
