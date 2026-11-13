import React from 'react';
import { ArrowRight } from 'lucide-react';

export const ActionQueue: React.FC = () => {
  const actions = [
    {
      id: 'act-1',
      type: 'counter_offer',
      title: 'Counter-Offer Received for Hydraulic Manifold',
      description: 'Kronos Precision adjusted unit price to $136.00/pc for 250 units with Ti-6Al-4V mill certs.',
      actionText: 'Review Offer',
      urgency: 'high',
      time: '18m ago',
    },
    {
      id: 'act-2',
      type: 'milestone',
      title: 'Pre-Shipment CMM Inspection Signed Off',
      description: 'Nordic Photonics uploaded 3D interferogram report for 15 telecentric lenses. Ready to release 40% milestone.',
      actionText: 'Authorize Release',
      urgency: 'high',
      time: '1h ago',
    },
    {
      id: 'act-3',
      type: 'sample',
      title: 'Evaluation Sample Dispatched from Yokohama',
      description: 'Carrier tracking updated for 5 PEEK medical cannula prototypes.',
      actionText: 'Track Shipment',
      urgency: 'normal',
      time: '3h ago',
    },
  ];

  return (
    <div className="rounded-card bg-canvas border border-white/10 p-5 space-y-4 shadow-md select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-tight uppercase">Action Queue</h3>
        </div>
        <span className="text-xs text-gold font-mono font-bold">2 Immediate Decisions</span>
      </div>

      <div className="space-y-2.5">
        {actions.map((act) => (
          <div
            key={act.id}
            className={`p-3.5 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              act.urgency === 'high'
                ? 'bg-gold/[0.08] border-gold/40'
                : 'bg-elevated/40 border-white/10'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{act.title}</span>
                <span className="text-[10px] text-ink-secondary tabular-nums font-mono">
                  {act.time}
                </span>
              </div>
              <p className="text-xs text-ink-secondary line-clamp-1">{act.description}</p>
            </div>

            <button
              type="button"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 transition-all ${
                act.urgency === 'high'
                  ? 'bg-gold hover:bg-gold-hover text-canvas shadow-sm'
                  : 'bg-elevated border border-white/15 text-white hover:border-gold/40'
              }`}
            >
              <span>{act.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
