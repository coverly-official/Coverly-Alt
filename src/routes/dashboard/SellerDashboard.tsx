import React, { useState } from 'react';
import { KPICard } from '@/components/dashboard/KPICard';
import { useRfqs } from '@/hooks/queries/useRfqs';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import type { Rfq } from '@/data/types';
import {
  FileSpreadsheet,
  Clock,
  Award,
  DollarSign,
  CheckCircle2,
  Check
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const { rfqs, refetch: refetchRfqs } = useRfqs();

  const [activeQuoteModalRfq, setActiveQuoteModalRfq] = useState<Rfq | null>(null);
  const [quotePrice, setQuotePrice] = useState(135);
  const [quoteLeadDays, setQuoteLeadDays] = useState(14);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleOpenQuoteModal = (rfq: Rfq) => {
    setActiveQuoteModalRfq(rfq);
    setQuotePrice(rfq.target_unit_price * 1.05); // slight counter proposal
    setQuoteLeadDays(14);
    setSubmitSuccess(false);
  };

  const handleQuoteSubmit = async () => {
    if (!activeQuoteModalRfq) return;
    setIsSubmittingQuote(true);

    try {
      // Simulate factory quotation submission
      setTimeout(() => {
        setIsSubmittingQuote(false);
        setSubmitSuccess(true);
        setTimeout(() => {
          setActiveQuoteModalRfq(null);
          refetchRfqs();
        }, 1200);
      }, 800);
    } catch {
      setIsSubmittingQuote(false);
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white tracking-tight">
          Manufacturer Portal & Sourcing Queue
        </h1>
        <p className="text-xs text-ink-secondary mt-1">
          Direct RFQs from enterprise hardware engineering and medical device buyers.
        </p>
      </div>

      {/* KPI Row (Frosted Glass Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          label="New Incoming RFQs"
          value={rfqs.length || 5}
          isActionRequired={true}
          actionNote="5 RFQs awaiting engineering quote"
          icon={<FileSpreadsheet className="w-4 h-4" />}
        />

        <KPICard
          label="Plant Quote Response Time"
          value="1.8 hrs"
          change="Top 5% on platform"
          isPositive={true}
          icon={<Clock className="w-4 h-4" />}
        />

        <KPICard
          label="Quote-to-Order Win Rate"
          value="42.8%"
          change="+6.2% vs last quarter"
          isPositive={true}
          icon={<Award className="w-4 h-4" />}
        />

        <KPICard
          label="Contract Revenue (This Month)"
          value="$314,500"
          change="Escrow pre-funded"
          isPositive={true}
          icon={<DollarSign className="w-4 h-4" />}
        />
      </div>

      {/* Incoming RFQs Queue */}
      <div className="rounded-card bg-canvas border border-white/10 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Direct Incoming RFQs</h3>
            <p className="text-xs text-ink-secondary">Review buyer tolerances, CAD attachments, and submit bids</p>
          </div>
          <span className="text-xs text-gold font-bold">
            {rfqs.length} Active Buying Inquiries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-elevated/90 text-ink-secondary border-b border-white/10">
              <tr>
                <th className="py-3 px-4 font-semibold">RFQ ID</th>
                <th className="py-3 px-4 font-semibold">Component Requested</th>
                <th className="py-3 px-4 font-semibold">Volume</th>
                <th className="py-3 px-4 font-semibold">Buyer Target Price</th>
                <th className="py-3 px-4 font-semibold">Destination Port</th>
                <th className="py-3 px-4 font-semibold">Attachments</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rfqs.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-[rgba(66,71,105,0.6)] transition-colors">
                  <td className="py-3 px-4 font-mono text-gold font-bold">{rfq.id}</td>
                  <td className="py-3 px-4 font-medium text-white max-w-[220px]">
                    <div className="truncate font-semibold">{rfq.product?.title || 'Custom Component'}</div>
                    <div className="text-[10px] text-ink-secondary truncate">{rfq.notes}</div>
                  </td>
                  <td className="py-3 px-4 tabular-nums font-semibold text-white">
                    {rfq.target_qty.toLocaleString()} units
                  </td>
                  <td className="py-3 px-4 tabular-nums font-bold text-white">
                    {formatCurrency(rfq.target_unit_price)}
                  </td>
                  <td className="py-3 px-4 text-ink-secondary truncate max-w-[150px]">
                    {rfq.destination_port}
                  </td>
                  <td className="py-3 px-4">
                    {rfq.attachment_urls.length > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-elevated border border-white/15 text-[10px] font-mono text-cyan-viz">
                        {rfq.attachment_urls.length} CAD files
                      </span>
                    ) : (
                      <span className="text-ink-tertiary">Specs in text</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenQuoteModal(rfq)}
                      className="text-xs h-8"
                    >
                      Quote RFQ
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Submission Modal */}
      <Modal
        isOpen={Boolean(activeQuoteModalRfq)}
        onClose={() => setActiveQuoteModalRfq(null)}
        title="Submit Manufacturing Quotation"
        description={`Replying to RFQ ${activeQuoteModalRfq?.id}`}
        maxWidth="md"
      >
        {submitSuccess ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-status-success mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Quotation Dispatched to Buyer</h4>
            <p className="text-xs text-ink-secondary">
              Buyer has been notified. When approved, contract escrow will be locked automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-canvas/70 border border-white/10 text-xs">
              <span className="font-bold text-white block truncate">
                {activeQuoteModalRfq?.product?.title}
              </span>
              <span className="text-ink-secondary">
                Target: {activeQuoteModalRfq?.target_qty.toLocaleString()} pcs @ ${activeQuoteModalRfq?.target_unit_price}/unit
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Quoted FOB Unit Price ($)"
                type="number"
                step="0.01"
                value={quotePrice}
                onChange={(e) => setQuotePrice(Number(e.target.value))}
              />
              <Input
                label="Guaranteed Lead Time (Days)"
                type="number"
                value={quoteLeadDays}
                onChange={(e) => setQuoteLeadDays(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Technical Notes / Tooling Inclusions
              </label>
              <textarea
                rows={3}
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                placeholder="State alloy certificates, CMM report turnaround, and shipping packaging..."
                className="w-full p-2.5 bg-canvas/80 text-white rounded-input border border-white/15 text-xs placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <div className="p-3 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-between text-xs">
              <span className="text-gold font-bold">Total Quote Value:</span>
              <span className="text-base font-bold text-white tabular-nums">
                ${((activeQuoteModalRfq?.target_qty || 1) * quotePrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveQuoteModalRfq(null)}
                className="px-4 py-2 text-xs font-medium text-ink-secondary hover:text-white"
              >
                Cancel
              </button>
              <Button
                variant="primary"
                size="md"
                isLoading={isSubmittingQuote}
                onClick={handleQuoteSubmit}
                className="font-bold gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Submit Direct Factory Quote</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SellerDashboard;
