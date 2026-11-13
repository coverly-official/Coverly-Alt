import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { storageService } from '@/services/storage';
import { rfqsService } from '@/services/rfqs';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Product } from '@/data/types';
import {
  ShieldCheck,
  UploadCloud,
  X,
  MessageCircle,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface RFQPanelProps {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  unitPrice: number;
  onUnitPriceChange: (price: number) => void;
}

export const RFQPanel: React.FC<RFQPanelProps> = ({
  product,
  quantity,
  onQuantityChange,
  unitPrice,
  onUnitPriceChange,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [destinationPort, setDestinationPort] = useState('Port of Rotterdam, NL');
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSampleSubmitting, setIsSampleSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<'rfq' | 'sample' | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Validation
  const minMoq = product.moq;
  const isBelowMoq = quantity < minMoq;
  const estimatedTotal = quantity * unitPrice;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSendRfq = async (isSample = false) => {
    if (!user) {
      navigate(`/sign-in?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (isSample) {
      setIsSampleSubmitting(true);
    } else {
      setIsSubmitting(true);
    }

    try {
      // 1. Upload attachments to InsForge Storage first
      const urls: string[] = [];
      const keys: string[] = [];
      for (const file of attachments) {
        const { data } = await storageService.uploadRfqAttachment(file);
        if (data) {
          urls.push(data.url);
          keys.push(data.key);
        }
      }

      // 2. Insert RFQ with stored URLs and keys
      await rfqsService.create({
        buyer_id: user.id,
        product_id: product.id,
        target_qty: isSample ? 5 : quantity,
        target_unit_price: isSample ? (product.sample_price || unitPrice * 1.5) : unitPrice,
        destination_port: destinationPort,
        notes: isSample ? `Sample Request: ${notes}` : notes,
        attachment_urls: urls,
        attachment_keys: keys,
        is_sample: isSample,
      });

      setSubmitSuccess(isSample ? 'sample' : 'rfq');
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSampleSubmitting(false);
        navigate('/dashboard/buyer');
      }, 1500);
    } catch {
      setIsSubmitting(false);
      setIsSampleSubmitting(false);
    }
  };

  return (
    <GlassCard
      variant="glass-strong"
      className="p-6 border border-white/20 shadow-2xl space-y-5 sticky top-24 select-none"
    >
      {/* Box Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            RFQ & Instant Sample Box
          </h3>
          <span className="text-[11px] text-ink-secondary">Direct plant engineering queue</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/40 text-[10px] font-bold">
          <ShieldCheck className="w-3 h-3" />
          <span>Escrow Protected</span>
        </div>
      </div>

      {submitSuccess ? (
        <div className="text-center py-8 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-status-success mx-auto animate-bounce" />
          <h4 className="text-base font-bold text-white">
            {submitSuccess === 'sample' ? 'Sample Order Dispatched' : 'Direct RFQ Dispatched!'}
          </h4>
          <p className="text-xs text-ink-secondary max-w-xs mx-auto">
            Uploaded drawings and requirements are saved in InsForge. Redirecting to your Buyer Dashboard...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quantity Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-white">Target Order Quantity</label>
              <span className="text-[11px] text-ink-secondary">MOQ: {minMoq} pcs</span>
            </div>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => onQuantityChange(Number(e.target.value))}
              error={isBelowMoq ? `Note: Factory minimum order is ${minMoq} units` : undefined}
            />
          </div>

          {/* Unit Price Target Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-white">Target Unit Price (USD)</label>
              <span className="text-[11px] text-ink-secondary">FOB Port</span>
            </div>
            <Input
              type="number"
              step="0.01"
              value={unitPrice}
              onChange={(e) => onUnitPriceChange(Number(e.target.value))}
            />
          </div>

          {/* Destination Port Select */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Target Destination Port
            </label>
            <select
              value={destinationPort}
              onChange={(e) => setDestinationPort(e.target.value)}
              className="w-full h-11 px-3.5 bg-canvas/80 text-white rounded-input border border-white/15 text-xs focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="Port of Rotterdam, NL">Port of Rotterdam, NL (North Europe)</option>
              <option value="Port of Long Beach, US">Port of Long Beach, US (US West Coast)</option>
              <option value="Port of Hamburg, DE">Port of Hamburg, DE (Central Europe)</option>
              <option value="Port of Singapore, SG">Port of Singapore, SG (Southeast Asia)</option>
              <option value="Port of Busan, KR">Port of Busan, KR (East Asia)</option>
            </select>
          </div>

          {/* File Attach Dropzone */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-white">Attach Drawings / 3D CAD</label>
              <span className="text-[10px] text-ink-tertiary">Max 20MB (.step, .pdf)</span>
            </div>
            <label className="border border-dashed border-white/20 hover:border-gold/60 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer bg-canvas/40 transition-colors">
              <UploadCloud className="w-4 h-4 text-gold shrink-0" />
              <span className="text-xs text-ink-secondary">Click to attach STEP / PDF drawings</span>
              <input
                type="file"
                multiple
                accept=".step,.stp,.dwg,.pdf,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Attached file list */}
            {attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {attachments.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-canvas/80 border border-white/10 text-[11px]"
                  >
                    <span className="text-white truncate max-w-[180px]">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(i)}
                      className="text-ink-secondary hover:text-status-error p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Specific Tolerance or QC Requirements
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Include mill material certificates, CMM report per batch..."
              className="w-full p-2.5 bg-canvas/80 text-white rounded-input border border-white/15 text-xs placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* Live Estimated Total with Tabular Numeral Display */}
          <div className="p-3.5 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-gold font-bold uppercase tracking-wider block">
                Estimated FOB Batch Total
              </span>
              <span className="text-[10px] text-ink-secondary">
                {quantity.toLocaleString()} pcs @ {formatCurrency(unitPrice)}
              </span>
            </div>
            <span className="text-lg font-bold tabular-nums text-white">
              {formatCurrency(estimatedTotal)}
            </span>
          </div>

          {/* Actions: Primary Send RFQ & Order Sample */}
          <div className="space-y-2.5 pt-1">
            <Button
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              onClick={() => handleSendRfq(false)}
              className="w-full font-bold shadow-lg"
            >
              Send RFQ
            </Button>

            {product.sample_available && (
              <Button
                variant="secondary"
                size="md"
                isLoading={isSampleSubmitting}
                onClick={() => handleSendRfq(true)}
                className="w-full text-xs font-semibold border-muted/50"
              >
                Order Evaluation Sample ({formatCurrency(product.sample_price || 95)})
              </Button>
            )}
          </div>

          {/* Chat with Factory Engineer Trigger with Online Presence */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setChatOpen(!chatOpen)}
              className="flex items-center gap-2 text-xs font-semibold text-ink-secondary hover:text-gold transition-colors"
            >
              <div className="relative">
                <MessageCircle className="w-4 h-4 text-gold" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-status-success animate-ping" />
              </div>
              <span>Chat with Factory Engineer</span>
            </button>
            <span className="text-[10px] text-emerald-400 font-mono">1.4h avg reply</span>
          </div>

          {/* Expanded simulated quick engineer chat */}
          {chatOpen && (
            <div className="p-3 rounded-xl bg-canvas/90 border border-white/15 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] text-gold font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Senior Tooling Engineer online (Stuttgart plant)</span>
              </div>
              <p className="text-[11px] text-ink-secondary">
                &ldquo;Hello! We have raw Ti-6Al-4V stock in our warehouse. Post an RFQ with your CAD and I will generate a formal toolpath quotation today.&rdquo;
              </p>
            </div>
          )}

          {/* Escrow Guarantee Footnote */}
          <div className="flex items-center gap-1.5 text-[10px] text-ink-tertiary justify-center">
            <Lock className="w-3 h-3 text-gold" />
            <span>Funds held in Tier-1 bank escrow until inspection sign-off</span>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
