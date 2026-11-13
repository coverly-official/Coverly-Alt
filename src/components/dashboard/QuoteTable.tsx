import React, { useState } from 'react';
import type { Quote } from '@/data/types';
import { quotesService } from '@/services/quotes';
import { StatusChip } from '@/components/ui/StatusChip';
import { FlagIcon } from '@/components/ui/FlagIcon';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { formatCurrency, cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface QuoteTableProps {
  quotes: Quote[];
  onRefresh: () => void;
}

export const QuoteTable: React.FC<QuoteTableProps> = ({ quotes, onRefresh }) => {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleStatusChange = async (quote: Quote, newStatus: Quote['status']) => {
    setIsUpdating(true);
    try {
      await quotesService.updateStatus(quote.id, newStatus);
      setActionSuccess(`Quote marked as ${newStatus}`);
      setTimeout(() => {
        setIsUpdating(false);
        setActionSuccess(null);
        setSelectedQuote(null);
        onRefresh();
      }, 1000);
    } catch {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="rounded-card bg-canvas border border-white/10 overflow-hidden shadow-lg select-none">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Active Factory Quotations</h3>
            <p className="text-xs text-ink-secondary">Review bids, counter-offers, and release escrow milestones</p>
          </div>
          <span className="text-xs text-gold font-bold">
            {quotes.filter((q) => q.status === 'counter_offered' || q.status === 'pending').length} Actions Required
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-elevated/90 text-ink-secondary border-b border-white/10 z-10">
              <tr>
                <th className="py-3 px-4 font-semibold">RFQ & Component</th>
                <th className="py-3 px-4 font-semibold">Verified Supplier</th>
                <th className="py-3 px-4 font-semibold">Batch Qty</th>
                <th className="py-3 px-4 font-semibold">Quoted Unit Price</th>
                <th className="py-3 px-4 font-semibold">Total FOB</th>
                <th className="py-3 px-4 font-semibold">Lead Time</th>
                <th className="py-3 px-4 font-semibold">Status / Action</th>
                <th className="py-3 px-4 font-semibold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {quotes.map((q) => {
                const isActionRequired = q.status === 'counter_offered';
                const total = q.qty * (q.counter_price || q.unit_price);

                return (
                  <tr
                    key={q.id}
                    onClick={() => setSelectedQuote(q)}
                    className={cn(
                      'cursor-pointer transition-colors duration-150',
                      'hover:bg-[rgba(66,71,105,0.6)]',
                      isActionRequired && 'bg-gold/[0.03]'
                    )}
                  >
                    <td className="py-3.5 px-4 font-medium text-white max-w-[200px]">
                      <div className="truncate font-semibold">{q.rfq?.product?.title || 'Industrial Part'}</div>
                      <div className="text-[10px] text-ink-secondary font-mono">{q.rfq_id}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <FlagIcon countryCode={q.supplier?.country_code ?? 'DE'} size="sm" />
                        <span className="truncate max-w-[130px]">{q.supplier?.name}</span>
                      </div>
                      <span className="text-[10px] text-ink-tertiary">
                        {q.supplier?.on_time_pct}% On-time
                      </span>
                    </td>

                    <td className="py-3.5 px-4 tabular-nums font-semibold text-white">
                      {q.qty.toLocaleString()} pcs
                    </td>

                    <td className="py-3.5 px-4 tabular-nums font-bold text-white">
                      {q.counter_offer && q.counter_price ? (
                        <div className="flex items-center gap-1.5">
                          <span className="line-through text-ink-secondary text-[11px]">
                            {formatCurrency(q.unit_price)}
                          </span>
                          <span className="text-gold font-bold">
                            {formatCurrency(q.counter_price)}
                          </span>
                        </div>
                      ) : (
                        <span>{formatCurrency(q.unit_price)}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 tabular-nums font-bold text-white">
                      {formatCurrency(total)}
                    </td>

                    <td className="py-3.5 px-4 tabular-nums text-ink-body">
                      {q.lead_time_days} days
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusChip status={q.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQuote(q);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-elevated border border-white/15 text-xs text-ink-body hover:text-white hover:border-gold/50"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Inspection Drawer (glass-strong) for Quote Details */}
      <Drawer
        isOpen={Boolean(selectedQuote)}
        onClose={() => setSelectedQuote(null)}
        title="Factory Quotation & Negotiation Dossier"
        description={`Quote ID: ${selectedQuote?.id} • Linked to ${selectedQuote?.rfq_id}`}
        width="lg"
      >
        {selectedQuote && (
          <div className="space-y-6 select-none">
            {actionSuccess && (
              <div className="p-3 rounded-xl bg-status-success/15 border border-status-success/30 text-status-success text-xs font-semibold">
                {actionSuccess}
              </div>
            )}

            {/* Product Summary */}
            <div className="p-4 rounded-xl bg-canvas/70 border border-white/10 space-y-1">
              <span className="text-[10px] text-ink-tertiary uppercase font-mono">
                Component Specification
              </span>
              <h4 className="text-base font-bold text-white">
                {selectedQuote.rfq?.product?.title}
              </h4>
              <p className="text-xs text-ink-secondary">
                Port: {selectedQuote.rfq?.destination_port}
              </p>
            </div>

            {/* Supplier Verification Line */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-canvas/70 border border-white/10">
              <div className="flex items-center gap-2.5">
                <FlagIcon countryCode={selectedQuote.supplier?.country_code ?? 'DE'} size="md" />
                <div>
                  <h5 className="text-xs font-bold text-white">{selectedQuote.supplier?.name}</h5>
                  <span className="text-[10px] text-emerald-400">
                    {selectedQuote.supplier?.on_time_pct}% On-time • {selectedQuote.supplier?.response_hours}h avg reply
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-gold/15 text-gold text-[10px] font-bold border border-gold/40">
                {selectedQuote.supplier?.tier} Verified
              </span>
            </div>

            {/* Commercial Numbers Matrix */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-canvas border border-white/10 text-xs">
              <div>
                <span className="text-ink-secondary text-[11px] block">Order Volume</span>
                <span className="text-base font-bold text-white tabular-nums">
                  {selectedQuote.qty.toLocaleString()} units
                </span>
              </div>
              <div>
                <span className="text-ink-secondary text-[11px] block">Quoted Unit Price</span>
                <span className="text-base font-bold text-gold tabular-nums">
                  {formatCurrency(selectedQuote.counter_price || selectedQuote.unit_price)}
                </span>
              </div>
              <div>
                <span className="text-ink-secondary text-[11px] block">FOB Settlement Total</span>
                <span className="text-base font-bold text-white tabular-nums">
                  {formatCurrency(selectedQuote.qty * (selectedQuote.counter_price || selectedQuote.unit_price))}
                </span>
              </div>
              <div>
                <span className="text-ink-secondary text-[11px] block">Guaranteed Lead Time</span>
                <span className="text-base font-bold text-white tabular-nums">
                  {selectedQuote.lead_time_days} days to port
                </span>
              </div>
            </div>

            {/* Engineer Notes */}
            {selectedQuote.notes && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
                  Plant Engineer Technical Notes
                </span>
                <div className="p-3.5 rounded-xl bg-canvas/50 border border-white/10 text-xs text-ink-body leading-relaxed">
                  &ldquo;{selectedQuote.notes}&rdquo;
                </div>
              </div>
            )}

            {/* Actions: Approve / Counter-offer / Decline */}
            <div className="pt-4 border-t border-white/10 space-y-2.5">
              {selectedQuote.status !== 'accepted' && (
                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isUpdating}
                  onClick={() => handleStatusChange(selectedQuote, 'accepted')}
                  className="w-full font-bold shadow-lg gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Lock Quote & Fund Escrow ({formatCurrency(selectedQuote.qty * (selectedQuote.counter_price || selectedQuote.unit_price))})</span>
                </Button>
              )}

              {selectedQuote.status === 'pending' && (
                <Button
                  variant="secondary"
                  size="md"
                  isLoading={isUpdating}
                  onClick={() => handleStatusChange(selectedQuote, 'counter_offered')}
                  className="w-full text-xs font-semibold"
                >
                  Request Counter-Offer Revision
                </Button>
              )}

              {selectedQuote.status !== 'declined' && selectedQuote.status !== 'accepted' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedQuote, 'declined')}
                  className="w-full text-center text-xs text-status-error hover:underline py-1"
                >
                  Decline Quotation
                </button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};
