import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

export const EscrowTimeline: React.FC = () => {
  const milestones = [
    {
      title: 'Milestone 1: Tooling Verification & Material Lock',
      pct: '30%',
      amount: '$10,200',
      status: 'released',
      date: 'Feb 28, 2026',
    },
    {
      title: 'Milestone 2: Pre-Shipment CMM Dimensional Sign-off',
      pct: '40%',
      amount: '$13,600',
      status: 'pending_release',
      date: 'Due Mar 16, 2026',
    },
    {
      title: 'Milestone 3: Port Arrival & Final Customs Release',
      pct: '30%',
      amount: '$10,200',
      status: 'locked',
      date: 'Est. Mar 28, 2026',
    },
  ];

  return (
    <div className="rounded-card bg-canvas border border-white/10 p-5 space-y-4 shadow-md select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-bold text-white tracking-tight uppercase">
            Order #PO-8821 Escrow Milestones
          </h3>
        </div>
        <span className="text-xs text-ink-secondary">Contract Total: $34,000</span>
      </div>

      <div className="space-y-3">
        {milestones.map((m, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-xl bg-canvas/60 border border-white/10 text-xs"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  m.status === 'released'
                    ? 'bg-status-success text-canvas'
                    : m.status === 'pending_release'
                    ? 'bg-gold text-canvas animate-pulse'
                    : 'bg-elevated text-ink-tertiary'
                }`}
              >
                {m.status === 'released' ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <div>
                <span className="font-bold text-white block">{m.title}</span>
                <span className="text-[10px] text-ink-secondary">{m.date}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-bold tabular-nums text-white block">{m.amount}</span>
              <span
                className={`text-[10px] font-semibold uppercase ${
                  m.status === 'released'
                    ? 'text-status-success'
                    : m.status === 'pending_release'
                    ? 'text-gold'
                    : 'text-ink-tertiary'
                }`}
              >
                {m.status === 'released' ? 'Released' : m.status === 'pending_release' ? 'Ready for Sign-off' : 'Locked'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
