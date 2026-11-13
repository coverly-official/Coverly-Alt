import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex p-1 rounded-2xl bg-canvas/80 border border-white/10 backdrop-blur-md',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 select-none flex items-center gap-2',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
              isActive
                ? 'bg-elevated text-white shadow-sm border border-white/15'
                : 'text-ink-secondary hover:text-white hover:bg-white/5'
            )}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums',
                  isActive ? 'bg-gold text-canvas' : 'bg-white/10 text-ink-secondary'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
